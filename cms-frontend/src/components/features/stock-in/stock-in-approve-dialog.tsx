// src/components/features/stock-in/stock-in-approve-dialog.tsx

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

export function StockInApproveDialog({
  stockIn,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  // stock-in-approve-dialog.tsx — fix undefined
  async function handleApprove() {
    if (!stockIn) return;
    setLoading(true);
    try {
      await stockInService.approve(stockIn.id);
      // Reload fresh data thay vì dùng response có thể undefined
      const fresh = await stockInService.getById(stockIn.id);
      onSuccess(fresh);
      onOpenChange(false);
    } catch (error) {
      console.error("Approve failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Duyệt phiếu nhập?</AlertDialogTitle>

          <AlertDialogDescription>
            Sau khi duyệt, phiếu nhập sẽ được xác nhận. Tồn kho có thể được cập
            nhật theo nghiệp vụ của hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleApprove}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Duyệt phiếu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
