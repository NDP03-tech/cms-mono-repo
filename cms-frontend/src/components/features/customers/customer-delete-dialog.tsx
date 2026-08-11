// src/components/features/customers/customer-delete-dialog.tsx
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
import { Customer } from "@/types/customer.types";
import { customerService } from "@/services/customer.service";

interface CustomerDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: Customer | null;
}

export function CustomerDeleteDialog({
  open,
  onClose,
  onSuccess,
  customer,
}: CustomerDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!customer) return;
    setIsLoading(true);
    try {
      // Khi kết nối BE thật uncomment:
      await customerService.delete(customer.id);
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
            Xóa khách hàng
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-500">
            Bạn có chắc muốn xóa khách hàng{" "}
            <span className="font-medium text-slate-700">{customer?.name}</span>
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
