// src/components/features/suppliers/supplier-delete-dialog.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Supplier } from "@/types/supplier.types";

interface SupplierDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier: Supplier | null;
}

export function SupplierDeleteDialog({
  open,
  onClose,
  onSuccess,
  supplier,
}: SupplierDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!supplier) return;
    setIsLoading(true);
    try {
      // Khi kết nối BE thật uncomment:
      // await supplierService.delete(supplier.id);

      await new Promise((resolve) => setTimeout(resolve, 400));
      onSuccess();
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-slate-900">
            Xóa nhà cung cấp
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-500">
            Bạn có chắc muốn xóa nhà cung cấp{" "}
            <span className="font-medium text-slate-700">{supplier?.name}</span>
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="h-9 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
