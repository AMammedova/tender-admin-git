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
import { Organization, organizationService } from "@/lib/services/organizationService";
import FormComponent from "./components/FormComponent";
import OrganizationTable from "./components/OrganizationTable";
import Pagination from "@/components/Pagination/Pagination";
import { useOrganizations } from "@/lib/hooks/useOrganization";

const OrganizationPage = () => {
  const t = useTranslations("Organizations");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Yeni hook-dan istifadə
  const {
    organizations,
    pagination,
    isLoading,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refetchOrganizations,
    isCreating,
    isUpdating,
    isDeleting,
  } = useOrganizations({ pageNumber, pageSize });

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleCreate = () => {
    setSelectedOrganization(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) {
      toast.error("ID tapılmadı!");
      return;
    }
    try {
      await deleteOrganization(id);
      toast.success(t("deleteSuccess"));
      refetchOrganizations();
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error(t("deleteError"));
    }
  };

  const handleSubmit = async (data: FormData | Partial<Organization>) => {
    try {
      if (selectedOrganization) {
        await updateOrganization({ id: selectedOrganization.id, organization: data });
        toast.success(t("updateSuccess"));
      } else {
        await createOrganization(data as FormData);
        toast.success(t("createSuccess"));
      }
      refetchOrganizations();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting organization:", error);
      toast.error(t("submitError"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button onClick={handleCreate}>{t("add")}</Button>
      </div>

      <OrganizationTable
        organizations={organizations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOrganization ? t("editOrganization") : t("createOrganization")}
            </DialogTitle>
          </DialogHeader>
          <FormComponent
            setIsDialogOpen={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            organizationId={selectedOrganization?.id}
            initialValues={selectedOrganization || undefined}
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

export default OrganizationPage;