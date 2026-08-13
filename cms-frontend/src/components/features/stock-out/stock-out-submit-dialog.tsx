// src/components/features/stock-out/stock-out-submit-dialog.tsx

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { StockOut } from "@/types/stock-out.types";

import { stockOutService } from "@/services/stock-out.service";

interface Props {
  stockOut: StockOut | null;
  open: boolean;

  onOpenChange: (open: boolean) => void;
  onSuccess: (stockOut: StockOut) => void;
}

export function StockOutSubmitDialog({
  stockOut,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!stockOut) return;
    setLoading(true);
    try {
      await stockOutService.submit(stockOut.id);
      const fresh = await stockOutService.getById(stockOut.id);
      onSuccess(fresh);
      onOpenChange(false);
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gửi phiếu duyệt?</AlertDialogTitle>

          <AlertDialogDescription>
            Sau khi gửi, phiếu sẽ chuyển sang trạng thái &quot;Chờ duyệt&quot;
            và không thể chỉnh sửa sản phẩm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleSubmit}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gửi duyệt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
