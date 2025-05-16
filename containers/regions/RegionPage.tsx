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
import { Region, regionService } from "@/lib/services/regionService";
import RegionTable from "./components/RegionTable";
import FormComponent from "./components/FormComponent";
import Pagination from "@/components/Pagination/Pagination";
import { useRegions } from "@/lib/hooks/useRegions";

const RegionPage = () => {
  const t = useTranslations("Regions");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    regions,
    pagination,
    isLoading,
    createRegion,
    updateRegion,
    deleteRegion,
    refetchRegions,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRegions({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedRegion(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (region: Region) => {
    setSelectedRegion(region);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deleteRegion(id);
      toast.success(t("deleteSuccess"));
      refetchRegions();
    } catch (error) {
      console.error("Error deleting region:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (data: Partial<Region>) => {
    try {
      if (selectedRegion) {
        await updateRegion({ id: selectedRegion.id, region: data });
        toast.success(t("updateSuccess"));
      } else {
        await createRegion(data as Omit<Region, "id">);
        toast.success(t("createSuccess"));
      }
      refetchRegions();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting region:", error);
      toast.error(t("submitError"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <RegionTable
        regions={regions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRegion ? t("editRegion") : t("createRegion")}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            regionId={selectedRegion?.id}
            initialValues={selectedRegion || undefined}
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

export default RegionPage;