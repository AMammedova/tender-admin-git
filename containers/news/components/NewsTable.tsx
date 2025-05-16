"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Edit, Trash2 } from "lucide-react";
import { News, NewsSets } from "@/containers/news/type/news-type";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";

interface NewsTableProps {
  news: News[];
  onEdit: (news: News) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const NewsTable: React.FC<NewsTableProps> = ({
  news,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const t = useTranslations("News");
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
 
  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId);
      setOpenAlert(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenAlert(false);
    setSelectedId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {news.map((news) =>
        Array.isArray(news.newsSets)
          ? news.newsSets.map((item: NewsSets) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 relative border"
              >
                {news.coverImage && (
                  <img
                    src={news.coverImage}
                    alt="cover"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(news)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedId(news.id);
                      setOpenAlert(true);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          : null
      )}
       <AlertDialogComponent
        open={openAlert}
        setOpen={setOpenAlert}
        title={t("delete_news") || "Xəbəri sil"}
        description={t("delete_confirm") || "Silmək istədiyinizə əminsiniz?"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default NewsTable;
