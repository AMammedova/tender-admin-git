import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ReusableSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const ReusableSheet: React.FC<ReusableSheetProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="z-999">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="grid gap-4 py-4 ">{children}</div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
};

export default ReusableSheet;
