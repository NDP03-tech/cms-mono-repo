// src/components/features/stock-out/stock-out-reject-dialog.tsx

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

export function StockOutRejectDialog({
  stockOut,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleReject() {
    if (!stockOut) return;
    setLoading(true);
    try {
      await stockOutService.reject(stockOut.id);
      const fresh = await stockOutService.getById(stockOut.id);
      onSuccess(fresh);
      onOpenChange(false);
    } catch (error) {
      console.error("Reject failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Từ chối phiếu xuất?</AlertDialogTitle>

          <AlertDialogDescription>
            Phiếu xuất sẽ chuyển sang trạng thái &quot;Từ chối&quot; và không
            thể tiếp tục xử lý.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Từ chối
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
