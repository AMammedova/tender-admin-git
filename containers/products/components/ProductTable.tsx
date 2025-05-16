"use client";
import React, { useState } from "react";
import DialogComponent from "../../../components/modal/DialogComponent";
import DetailSection from "./DetailSection";
import FormComponent from "./FormComponent";
import { Product } from "../types/product-type";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) => {
  const t = useTranslations("Products");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleDrawer = (product?: Product) => {
    setIsEditing(false);
    if (product) {
      setSelectedProduct(product);
      setOpen(true);
    } else {
      setSelectedProduct(null);
      setOpen(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
            {/* <TableHead>{t("images")}</TableHead> */}
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("detail")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                   {/* <TableCell><Image src={product.Image?.[0]?.imageUrl}width={30} alt="table-image"/></TableCell> */}
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.categoryDto?.name}</TableCell>
                <TableCell>{product.detail}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => product.id !== undefined && onUpdate(product.id)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => product.id !== undefined && onDelete(product.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DialogComponent
        open={open}
        setOpen={setOpen}
        toggleDrawer={toggleDrawer}
        title={isEditing ? "Edit Product" : "Product Details"}
      >
        {isEditing ? (
          <FormComponent
            setIsDialogOpen={setOpen}
            initialValues={selectedProduct || undefined}
          />
        ) : (
          <DetailSection product={selectedProduct} />
        )}
      </DialogComponent>
    </>
  );
};

export default ProductTable;
