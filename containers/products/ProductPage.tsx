
"use client";
import React, { useState, useEffect } from "react";
import ProductTable from "@/containers/products/components/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaginationComponent from "@/components/Pagination/Pagination";
import ReusableSheet from "@/components/Sheet/SheetComponent";
import { FilterIcon, Download, Search, Plus } from "lucide-react";
import FilterComponent from "./components/FilterComponent";
import FormComponent from "./components/FormComponent";
import DialogComponent from "../../components/modal/DialogComponent";
import { useTranslations } from "next-intl";
import { useProducts } from "@/lib/hooks/useProducts";
import { productService } from "@/lib/services/productService";

const ProductPage = () => {
  const t = useTranslations("Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, selectedCategories, dateFrom, dateTo]);

  const { products, pagination, isLoading, refetchProducts, isDeleting } = useProducts({
    CategoryIds: selectedCategories.length ? selectedCategories : undefined,
    SearchTerm: searchTerm || undefined,
    CreatedFrom: dateFrom || undefined,
    CreatedTo: dateTo || undefined,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });
  console.log(products, "products");

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (id: number) => {
    setSelectedProductId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProductId(null);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm(t('confirm_delete'))) {
      try {
        await productService.deleteProduct(id);
        refetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    refetchProducts();
  };

  const handleApplyFilters = (filters: any) => {
    setSelectedCategories(filters.categoryIds);
    setDateFrom(filters.dateRange.from);
    setDateTo(filters.dateRange.to);
    setPageNumber(1);
  };

  return (
    <React.Fragment>
      <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search_placeholder")}
              className="bg-white dark:bg-background pl-8 py-5 h-12 sm:h-auto"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleExport}
                className="w-full sm:w-auto h-10 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t?.("export")}</span>
              </Button>

              <Button
                onClick={() => setIsSheetOpen(true)}
                className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white"
              >
                <FilterIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t?.("filter_title")}</span>
                <span className="sm:hidden sr-only">{t?.("filter_title")}</span>
              </Button>
            </div>
          </div>
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium">{t("active_filters")}:</span>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-800 text-xs rounded-full px-3 py-1 flex items-center">
                  <span>{t("categories")}: {selectedCategories.length}</span>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              )}

              {(dateFrom || dateTo) && (
                <div className="bg-gray-100 dark:bg-gray-800 text-xs rounded-full px-3 py-1 flex items-center">
                  <span>{t("date_filter")}</span>
                  <button
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-end px-2 sm:px-0 my-4">
        <Button
          onClick={handleAddProduct}
          className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white text-sm"
        >
          <Plus className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="hidden sm:inline">{t?.("add_product")}</span>
          <span className="sm:hidden">{t?.("add")}</span>
        </Button>
      </div>

      <ProductTable
        products={products}
        isLoading={isLoading}
        onUpdate={handleEditProduct}
        onDelete={handleDeleteProduct}
        isUpdating={false}
        isDeleting={isDeleting}
      />

      {pagination && (
        <PaginationComponent
          currentPage={pagination.pageNumber || 1}
          totalPages={pagination.totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}

      <ReusableSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={t("filter_title")}
      >
        <FilterComponent
          onApplyFilters={handleApplyFilters}
          initialFilters={{
            categoryIds: selectedCategories,
            dateRange: {
              from: dateFrom,
              to: dateTo
            }
          }}
          onClose={() => setIsSheetOpen(false)}
          className="z-[999999999999999]"
        />
      </ReusableSheet>

      <DialogComponent
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        toggleDrawer={handleCloseDialog}
        title={selectedProductId ? t("edit_product") : t("add_product")}
      >
        <FormComponent
          setIsDialogOpen={setIsDialogOpen}
          productId={selectedProductId}
          onSuccess={handleFormSuccess}
          key={selectedProductId || 'new-product'}
        />
      </DialogComponent>
    </React.Fragment>
  );
};

export default ProductPage;