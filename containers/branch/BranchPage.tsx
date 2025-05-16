"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast, Toaster } from "sonner";
import { Branch } from "./types/branch-type";
import FormComponent from "./components/FormComponent";
import BranchTable from "./components/BranchTable";
import Pagination from "@/components/Pagination/Pagination";
import DialogComponent from "@/components/modal/DialogComponent";
import { useBranchs } from "@/lib/hooks/useBranchs";

const BranchPage = () => {
  const t = useTranslations("Branchs");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    branchs: branches,
    pagination,
    isLoading,
    createBranch,
    updateBranch,
    deleteBranch,
    refetchBranches,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBranchs({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBranch(null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deleteBranch(id);
      toast.success(t("deleteSuccess"));
      refetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (data: Partial<Branch>) => {
    try {
      setIsSubmitting(true);
      if (selectedBranch) {
        await updateBranch({ id: selectedBranch.id, branch: data });
        toast.success(t("updateSuccess"));
      } else {
        await createBranch({
          name: data.name || "",
          code: data.code || 0,
          address: typeof data.address === 'string'
            ? { name: data.address, latitude: 0, longitude: 0 }
            : {
                name: data.address?.name || "",
                latitude: data.address?.latitude || 0,
                longitude: data.address?.longitude || 0,
              },
        });
        toast.success(t("createSuccess"));
      }
      refetchBranches();
    } catch (error) {
      console.error("Error submitting branch:", error);
      toast.error(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <BranchTable
        branchs={branches}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <DialogComponent
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        toggleDrawer={handleCloseDialog}
        title= {selectedBranch ? t("editBranch") : t("createBranch")}
        size='md'
      >
        <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            branchId={selectedBranch?.id}
            initialValues={selectedBranch || undefined}
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

export default BranchPage;