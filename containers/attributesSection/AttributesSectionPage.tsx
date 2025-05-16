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
import FormComponent from "./components/FormComponent";
import Pagination from "@/components/Pagination/Pagination";
import { AttributesSection } from "./types/attributesSection-type";
import { useAttributesSection } from "@/lib/hooks/useAttributesSection";
import AttributesSectionTable from "./components/AttributesSectionTable";
const AttributesSectionPage = () => {
  const t = useTranslations("AttributesSection");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttributeSection, setSelectedAttributeSection] = useState<AttributesSection | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    attributeSections,
    pagination,
    isLoading,
    createAttributeSection,
    updateAttributeSection,
    deleteAttributeSection,
    refetchAttributeSections,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAttributesSection({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedAttributeSection(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (attributeSections: AttributesSection) => {
    setSelectedAttributeSection(attributeSections);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deleteAttributeSection(id);
      toast.success(t("deleteSuccess"));
      refetchAttributeSections();
    } catch (error) {
      console.error("Error deleting attributeSections:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (data: Partial<AttributesSection>) => {
    try {
      if (selectedAttributeSection) {
        await updateAttributeSection({ id: selectedAttributeSection.id, attributeSection: data });
        toast.success(t("updateSuccess"));
      } else {
        await createAttributeSection(data as Omit<AttributesSection, "id">);
        toast.success(t("createSuccess"));
      }
      refetchAttributeSections();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting attributeSections:", error);
      toast.error(t("submitError"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <AttributesSectionTable
        attributeSections={attributeSections}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAttributeSection ? t("editAttributeSection") : t("createAttributeSection")}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            attributeSectionId={selectedAttributeSection?.id}
            initialValues={selectedAttributeSection || undefined}
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

export default AttributesSectionPage;