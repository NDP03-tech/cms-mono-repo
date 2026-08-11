// src/components/features/stock-in/stock-in-actions.tsx

"use client";

import { Eye, Send, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StockIn, StockInStatus } from "@/types/stock-in.types";

interface Props {
  stockIn: StockIn;

  onView: (stockIn: StockIn) => void;
  onSubmit?: (stockIn: StockIn) => void;
  onApprove?: (stockIn: StockIn) => void;
  onReject?: (stockIn: StockIn) => void;
}

export function StockInActions({
  stockIn,
  onView,
  onSubmit,
  onApprove,
  onReject,
}: Props) {
  const status: StockInStatus = stockIn.status;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onView(stockIn)}
        className="h-8 w-8 text-slate-400 hover:text-slate-900"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {status === "draft" && onSubmit && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSubmit(stockIn)}
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
              onClick={() => onApprove(stockIn)}
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
              onClick={() => onReject(stockIn)}
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
