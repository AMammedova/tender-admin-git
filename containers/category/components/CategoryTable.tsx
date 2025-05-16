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
import { Edit, Trash2, Eye } from "lucide-react";
import { Category } from "../types/category-type";
import { toast } from "sonner";
import ViewCategoryModal from "./ViewCategoryModal";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";
import { categoryService } from "@/lib/services/categoryService";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  refetch: () => void;
  showParentColumn?: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
  refetch,
  showParentColumn = true,
}) => {
  const t = useTranslations("Categories");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await categoryService.deleteCategory(deleteId);
        toast.success(response.message || t("deleteSuccess"));
        await onDelete(deleteId);
        refetch();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || t("deleteError"));
      } finally {
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleViewClick = async (category: Category) => {
    setViewCategory(category);
    setIsViewModalOpen(true);
    // Fetch parent category if exists
    if (category.parentId) {
      try {
        const response = await categoryService.CategoryById(category.parentId);
        setParentCategory(response.responseValue);
      } catch {
        setParentCategory(null);
      }
    } else {
      setParentCategory(null);
    }
  };

  // Tree view rendering for children
  const renderTree = (category: Category, level = 0) => (
    <div style={{ marginLeft: level * 24, display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
      {level > 0 && <span style={{ color: '#bbb', fontSize: 18 }}>└─</span>}
      <span className="font-medium">{category.name}</span>
      <span className={`px-2 py-0.5 rounded text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{category.isActive ? 'Active' : 'Inactive'}</span>
    </div>
  );

  const renderChildrenTree = (children: Category[] = [], level = 1) => (
    <div>
      {children.map(child => (
        <div key={child.id}>
          {renderTree(child, level)}
          {child.children && child.children.length > 0 && renderChildrenTree(child.children, level + 1)}
        </div>
      ))}
    </div>
  );

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
            <TableHead>{t("name")}</TableHead>
            {showParentColumn && <TableHead>{t("parentName")}</TableHead>}
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              {showParentColumn && <TableCell>{category.parentCategoryName}</TableCell>}
              <TableCell>
                {category.isActive ? (
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">Active</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold">Inactive</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewClick(category)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(category.id)}
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
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
      {isViewModalOpen && viewCategory && (
        <ViewCategoryModal
          open={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewCategory(null);
            setParentCategory(null);
          }}
          category={viewCategory}
          parentCategory={parentCategory}
        />
      )}
    </div>
  );
};

export default CategoryTable;
