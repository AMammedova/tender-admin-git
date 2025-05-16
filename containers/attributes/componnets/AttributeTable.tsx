import React, { useState } from "react";
import { Attribute } from "@/lib/services/attributeService";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import AlertDialogComponent from "@/components/AlertDiolog/AlertDiolog";

interface AttributeTableProps {
    attributes: Attribute[];
    isLoading: boolean;
    onUpdate: (id: number) => void;
    onDelete: (id: number) => void;
    isDeleting?: boolean;
}

const AttributeTable: React.FC<AttributeTableProps> = ({
    attributes,
    isLoading,
    onUpdate,
    onDelete,
    isDeleting,
}) => {
    const t = useTranslations("Attributes");
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setOpenAlert(true);
    };

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
            <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t("name")}</TableHead>
                        <TableHead>{t("category")}</TableHead>
                        <TableHead>{t("parent_attribute")}</TableHead>
                        <TableHead>{t("is_changeable")}</TableHead>
                        <TableHead>{t("section")}</TableHead>
                        <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attributes.map((attr) => (
                        <TableRow key={attr.id}>
                            <TableCell>{attr.id}</TableCell>
                            <TableCell>{attr.name}</TableCell>
                            <TableCell>{attr.categoryName}</TableCell>
                            <TableCell>{attr.parentAttributeName}</TableCell>
                            <TableCell>{attr.isChangeable ? t("yes") : t("no")}</TableCell>
                            <TableCell>{attr.sectionName}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onUpdate(attr.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(attr.id)}
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
            <AlertDialogComponent
                open={openAlert}
                setOpen={setOpenAlert}
                title={t("delete_attribute") || "Atributu sil"}
                description={t("delete_confirm") || "Silmək istədiyinizə əminsiniz?"}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default AttributeTable;