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
import { Edit, Trash2 } from "lucide-react";
import { Branch } from "../types/branch-type";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";

interface BranchTableProps {
  branchs: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const BranchTable: React.FC<BranchTableProps> = ({
  branchs,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const t = useTranslations("Branchs");
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId);
      setOpenAlert(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenAlert(false);
    setSelectedId(null);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("address")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branchs.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell className="font-medium">{branch.address.name}</TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(branch)}
                    //   disabled={isUpdating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedId(branch.id);
                      setOpenAlert(true);
                    }}
                    //   disabled={isDeleting}
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
        open={openAlert}
        setOpen={setOpenAlert}
        title={t("delete_branch") || "Branchı sil"}
        description={t("delete_confirm") || "Silmək istədiyinizə əminsiniz?"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default BranchTable;
