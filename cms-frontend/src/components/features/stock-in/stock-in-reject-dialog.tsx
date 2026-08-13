// src/components/features/stock-in/stock-in-reject-dialog.tsx

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

export function StockInRejectDialog({
  stockIn,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  // stock-in-reject-dialog.tsx — fix undefined
  async function handleReject() {
    if (!stockIn) return;
    setLoading(true);
    try {
      await stockInService.reject(stockIn.id);
      const fresh = await stockInService.getById(stockIn.id);
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
          <AlertDialogTitle>Từ chối phiếu nhập?</AlertDialogTitle>

          <AlertDialogDescription>
            Phiếu nhập sẽ chuyển sang trạng thái &quot;Từ chối&quot; và không
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
