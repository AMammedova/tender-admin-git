"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import FormComponent from "./components/FormComponent";
import PartnerTable from "./components/PartnerTable";
import { Partner } from "./types/partner-type";
import Pagination from "@/components/Pagination/Pagination";
import { usePartners } from "@/lib/hooks/usePartners";

const PartnerPage = () => {
  const t = useTranslations("Partners");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // usePartners hook
  const {
    partners,
    pagination,
    isLoading,
    createPartner,
    updatePartner,
    deletePartner,
    refetchPartners,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePartners({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedPartner(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deletePartner(id);
      toast.success(t("deleteSuccess"));
      refetchPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (data: FormData | Partial<Partner>) => {
    try {
      if (selectedPartner) {
        await updatePartner({ id: selectedPartner.id, partner: data });
        toast.success(t("updateSuccess"));
      } else {
        await createPartner(data as FormData);
        toast.success(t("createSuccess"));
      }
      refetchPartners();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting partner:", error);
      toast.error(t("submitError"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <PartnerTable
        partners={partners}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPartner ? t("editPartner") : t("createPartner")}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            partnerId={selectedPartner?.id}
            initialValues={selectedPartner || undefined}
          />
        </DialogContent>
      </Dialog>
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

export default PartnerPage;