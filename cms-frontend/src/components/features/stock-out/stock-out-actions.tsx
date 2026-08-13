// src/components/features/stock-out/stock-out-actions.tsx

"use client";

import { Eye, Send, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StockOut, StockOutStatus } from "@/types/stock-out.types";

interface Props {
  stockOut: StockOut;

  onView: (stockOut: StockOut) => void;
  onSubmit?: (stockOut: StockOut) => void;
  onApprove?: (stockOut: StockOut) => void;
  onReject?: (stockOut: StockOut) => void;
}

export function StockOutActions({
  stockOut,
  onView,
  onSubmit,
  onApprove,
  onReject,
}: Props) {
  const status: StockOutStatus = stockOut.status;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onView(stockOut)}
        className="h-8 w-8 text-slate-400 hover:text-slate-900"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {status === "draft" && onSubmit && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSubmit(stockOut)}
          className="h-8 w-8 text-slate-400 hover:text-slate-900"
        >
          <Send className="h-4 w-4" />
        </Button>
      )}

      {status === "pending" && (
        <>
          {onApprove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onApprove(stockOut)}
              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}

          {onReject && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onReject(stockOut)}
              className="h-8 w-8 text-red-500 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
