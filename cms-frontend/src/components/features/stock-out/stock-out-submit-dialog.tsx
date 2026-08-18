// src/components/features/stock-out/stock-out-submit-dialog.tsx

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!stockOut) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const updatedStockOut = await stockOutService.submit(stockOut.id);

      if (updatedStockOut) {
        onSuccess(updatedStockOut);
      } else {
        // Fallback nếu API submit không trả về StockOut
        const fresh = await stockOutService.getById(stockOut.id);
        onSuccess(fresh);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Submit failed:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
          setErrorMessage(message.join(", "));
        } else if (typeof message === "string") {
          setErrorMessage(message);
        } else {
          setErrorMessage("Không thể gửi phiếu duyệt. Vui lòng thử lại.");
        }
      } else {
        setErrorMessage("Không thể gửi phiếu duyệt. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value && !loading) {
      setErrorMessage(null);
    }

    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gửi phiếu duyệt?</AlertDialogTitle>

          <AlertDialogDescription>
            Sau khi gửi, phiếu sẽ chuyển sang trạng thái &quot;Chờ duyệt&quot;
            và không thể chỉnh sửa sản phẩm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-sm font-medium text-red-700">
              Không thể gửi phiếu
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {errorMessage}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleSubmit}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {loading ? "Đang gửi..." : "Gửi duyệt"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
