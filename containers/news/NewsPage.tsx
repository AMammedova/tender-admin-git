'use client'
import React, { useState} from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import NewsTable from "./components/NewsTable";
import FormComponent from "./components/FormComponent";
import { useNews } from "@/lib/hooks/useNews";
import Pagination from "@/components/Pagination/Pagination";
import { News, NewsSets } from "@/containers/news/type/news-type";
import DialogComponent from "@/components/modal/DialogComponent";
import { useTranslations } from "next-intl";

const NewsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const t = useTranslations("News");
  const {
    news,
    pagination,
    isLoading,
    createNews,
    updateNews,
    deleteNews,
    refetchNews,
    isCreating,
    isUpdating,
    isDeleting,
  } = useNews({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };
  const handleCreate = () => {
    setSelectedNews(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedNews(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNews(id);
      toast.success(t("deleteSuccess"));
      refetchNews();
    } catch {
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async ({
    newsSets,
    images,
    coverImage,
    deletedImgId = [],
  }: {
    newsSets: NewsSets[];
    images: File[];
    coverImage: File | null;
    deletedImgId?: number[];
  }) => {
    try {
      if (selectedNews) {
        await updateNews({ id: selectedNews.id, newsSets, images, coverImage, deletedImgId });
        toast.success(t("updateSuccess"));
      } else {
        await createNews({ newsSets, images, coverImage });
        toast.success(t("createSuccess"));
      }
      refetchNews();
      setIsDialogOpen(false);
    } catch {
      toast.error(t("submitError"));
    }
  };
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>
      <NewsTable
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      
      <DialogComponent
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        toggleDrawer={handleCloseDialog}
        title= {selectedNews ? t("editNews") : t("addNews")}
        size='md'
      >
        <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            newsId={selectedNews?.id}
            initialValues={selectedNews || undefined}
          />
      </DialogComponent>
      {pagination && (
        <Pagination
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default NewsPage;