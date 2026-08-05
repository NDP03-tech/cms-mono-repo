// src/components/features/products/product-delete-dialog.tsx
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
import { Product } from "@/types/product.types";

interface ProductDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

export function ProductDeleteDialog({
  open,
  onClose,
  onSuccess,
  product,
}: ProductDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    if (!product) return;
    setIsLoading(true);
    try {
      // Khi kết nối BE thật uncomment:
      // await productService.delete(product.id);

      // Mock — giả lập delay
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
            Xóa sản phẩm
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-500">
            Bạn có chắc muốn xóa sản phẩm{" "}
            <span className="font-medium text-slate-700">{product?.name}</span>{" "}
            ({product?.sku})? Hành động này không thể hoàn tác.
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
