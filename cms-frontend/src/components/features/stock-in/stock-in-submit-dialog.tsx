// src/components/features/stock-in/stock-in-submit-dialog.tsx

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

import { StockIn } from "@/types/stock-in.types";

import { stockInService } from "@/services/stock-in.service";

interface Props {
  stockIn: StockIn | null;
  open: boolean;

  onOpenChange: (open: boolean) => void;
  onSuccess: (stockIn: StockIn) => void;
}

export function StockInSubmitDialog({
  stockIn,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!stockIn) return;

    setLoading(true);

    try {
      const updated = await stockInService.submit(stockIn.id);

      onSuccess(updated);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
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
            Sau khi gửi, phiếu sẽ chuyển sang trạng thái "Chờ duyệt" và không
            thể chỉnh sửa sản phẩm.
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
