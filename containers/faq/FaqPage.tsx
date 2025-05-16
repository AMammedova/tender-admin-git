"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import FaqTable from "./components/FaqTable";
import FormComponent from "./components/FormComponent";
import { Faq, FaqSetDto } from "./types/faq-type";
import { useFaqs } from "@/lib/hooks/useFaq";
import Pagination from "@/components/Pagination/Pagination";

const FaqPage = () => {
  const t = useTranslations("Faqs");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    faqs,
    pagination,
    isLoading,
    createFaq,
    updateFaq,
    deleteFaq,
    refetchFaqs,
    isCreating,
    isUpdating,
    isDeleting,
  } = useFaqs({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedFaq(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deleteFaq(id);
      toast.success(t("deleteSuccess"));
      refetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (faqSetDtos: FaqSetDto[]) => {
    try {
      if (selectedFaq) {
        await updateFaq({ id: selectedFaq.id, faqSetDtos });
        toast.success(t("updateSuccess"));
      } else {
        await createFaq(faqSetDtos);
        toast.success(t("createSuccess"));
      }
      refetchFaqs();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      toast.error(t("submitError"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <FaqTable
        faqs={faqs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFaq ? t("editFaq") : t("createFaq")}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            faqId={selectedFaq?.id}
            initialValues={selectedFaq || undefined}
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

export default FaqPage;