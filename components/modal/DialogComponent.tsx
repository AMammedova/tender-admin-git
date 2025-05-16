"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogComponentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDrawer: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-[400px]',
  md: 'max-w-[600px]',
  lg: 'max-w-[800px]',
  xl: 'max-w-[1200px]',
};

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  setOpen,
  toggleDrawer,
  title,
  children,
  size = 'xl',
  className,
}) => {
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      toggleDrawer();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden bg-white dark:bg-boxdark rounded-lg",
          sizeClasses[size],
          className
        )}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative">
          <DialogHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className={cn(
            "px-4 py-3 overflow-y-auto",
            "max-h-[calc(90vh-40px)]",
            "scrollbar scrollbar-w-[1px] scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700",
            "hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600"
          )}>
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
