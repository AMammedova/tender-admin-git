"use client";
import React, { useState, useEffect } from "react";
import AttributeTable from "./componnets/AttributeTable";
import AttributeForm from "./componnets/AttributeForm";
import { useAttributes } from "@/lib/hooks/useAttribute";
import { Button } from "@/components/ui/button";
import DialogComponent from "@/components/modal/DialogComponent";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Pagination from "@/components/Pagination/Pagination";

const AttributesPage = () => {
  const t = useTranslations("Attributes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
  }, [searchTerm]);

  const {
    attributes,
    pagination,
    isLoading,
    refetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAttributes({
    SearchTerm: searchTerm || undefined,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const handleAdd = () => {
    setSelectedAttribute(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: number) => {
    const attr = attributes.find((a) => a.id === id);
    setSelectedAttribute(attr);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteAttribute(id);
    refetchAttributes();
  };

  const handleFormSubmit = (data: any) => {
    if (selectedAttribute) {
      updateAttribute({ ...selectedAttribute, ...data });
    } else {
      createAttribute(data);
    }
    setIsDialogOpen(false);
    refetchAttributes();
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  return (
    <React.Fragment>
      <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search_attribute")}
              className="bg-white dark:bg-background pl-8 py-5 h-12 sm:h-auto"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <Button
              onClick={handleAdd}
              className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white text-sm"
            >
              <Plus className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">{t("add_attribute")}</span>
              <span className="sm:hidden">{t("add")}</span>
            </Button>
          </div>
        </div>
      </div>
      <AttributeTable
        attributes={attributes}
        isLoading={isLoading}
        onUpdate={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
      {pagination && (
        <Pagination
          currentPage={pagination.pageNumber || 1}
          totalPages={pagination.totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}
      <DialogComponent
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        toggleDrawer={() => setIsDialogOpen(false)}
        title={selectedAttribute ? "Edit Attribute" : "Add Attribute"}
        size="lg"
      >
        <AttributeForm
          initialData={selectedAttribute}
          onSubmit={handleFormSubmit}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogComponent>
    </React.Fragment>
  );
};

export default AttributesPage;