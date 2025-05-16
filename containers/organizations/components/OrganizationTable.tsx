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
import { Organization } from "@/lib/services/organizationService";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  organizations,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const t = useTranslations("Organizations");
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
            <TableHead>{t("description")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell className="font-medium">{organization.name}</TableCell>
              <TableCell className="font-medium">{organization.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                 
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(organization)}
                    //   disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                 
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedId(organization.id);
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
        title={t("delete_organization") || "Organizationı sil"}
        description={t("delete_confirm") || "Silmək istədiyinizə əminsiniz?"}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default OrganizationTable;
