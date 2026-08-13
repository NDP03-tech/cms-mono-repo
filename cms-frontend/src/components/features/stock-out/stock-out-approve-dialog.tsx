// src/components/features/stock-out/stock-out-approve-dialog.tsx

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

export function StockOutApproveDialog({
  stockOut,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    if (!stockOut) return;
    setLoading(true);
    try {
      await stockOutService.approve(stockOut.id);
      const fresh = await stockOutService.getById(stockOut.id);
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
          <AlertDialogTitle>Duyệt phiếu xuất?</AlertDialogTitle>

          <AlertDialogDescription>
            Sau khi duyệt, phiếu xuất sẽ được xác nhận. Tồn kho có thể được cập
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
