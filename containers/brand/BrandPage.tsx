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
import { Brand } from "./types/brand-type";
import FormComponent from "./components/FormComponent";
import BrandTable from "./components/BrandTable";
import Pagination from "@/components/Pagination/Pagination";
import { useBrands } from "@/lib/hooks/useBrands";

const BrandPage = () => {
  const t = useTranslations("Brands");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    brands,
    pagination,
    isLoading,
    createBrand,
    updateBrand,
    deleteBrand,
    refetchBrands,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBrands({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedBrand(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deleteBrand(id);
      toast.success(t("deleteSuccess"));
      refetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (data: Partial<Brand>) => {
    try {
      if (selectedBrand) {
        await updateBrand({ id: selectedBrand.id, brand: data });
        toast.success(t("updateSuccess"));
      } else {
        await createBrand({
          name: data.name || "",
          categoryId: Number(data.categoryId),
        });
        toast.success(t("createSuccess"));
      }
      refetchBrands();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting brand:", error);
      toast.error(t("submitError"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <BrandTable
        brands={brands as unknown as Brand[]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBrand ? t("editBrand") : t("createBrand")}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            brandId={selectedBrand?.id}
            initialValues={selectedBrand || undefined}
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

export default BrandPage;