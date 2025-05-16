"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Edit, Trash2 } from "lucide-react";
import { Partner } from "../types/partner-type";
import Image from "next/image";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";

interface PartnerTableProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const PartnerTable: React.FC<PartnerTableProps> = ({
  partners,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const t = useTranslations("Partners");
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("img")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium"><Image src={partner?.img} alt={"partner"} width={60} height={60} /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                 
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(partner)}
                    //   disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                 
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedId(partner.id);
                        setOpenAlert(true);
                      }}
                    //   disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialogComponent
        open={openAlert}
        setOpen={setOpenAlert}
        title={t("delete_partner") || "Partner sil"}
        description={t("delete_confirm") || "Silmək istədiyinizə əminsiniz?"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        />
    </div>
  );
};

export default PartnerTable;
