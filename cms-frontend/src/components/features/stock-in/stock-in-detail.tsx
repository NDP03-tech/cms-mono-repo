// src/components/features/stock-in/stock-in-detail.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Send, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { StockIn } from "@/types/stock-in.types";

import { StockInStatusBadge } from "./stock-in-status-badge";
import { StockInInfo } from "./stock-in-info";
import { StockInItemsEditor } from "./stock-in-items-editor";

import { StockInSubmitDialog } from "./stock-in-submit-dialog";
import { StockInApproveDialog } from "./stock-in-approve-dialog";
import { StockInRejectDialog } from "./stock-in-reject-dialog";

import { Product } from "@/types/product.types";

import { StockInItemDraft } from "@/types/stock-in.types";

interface Props {
  initialStockIn: StockIn;
}

export function StockInDetail({ initialStockIn }: Props) {
  const [stockIn, setStockIn] = useState<StockIn>(initialStockIn);

  const [submitOpen, setSubmitOpen] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);

  const isDraft = stockIn.status === "draft";
  const isPending = stockIn.status === "pending";

  const items: StockInItemDraft[] = (stockIn.items ?? []).map((item) => ({
    tempId: item.id,
    productId: item.productId,
    productName: item.productName,
    productSku: item.productSku,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    currency: item.currency,
  }));

  function handleAdd(_product: Product) {
    // Detail editor nên gọi API addItem.
    // Có thể triển khai ở đây hoặc tách mutation hook.
  }

  function handleChange(
    _itemId: string,
    _field: "quantity" | "unitPrice",
    _value: number,
  ) {
    // Tương tự: gọi stockInService.updateItem().
  }

  function handleRemove(_itemId: string) {
    // Gọi stockInService.removeItem().
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/stock-in"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-lg font-semibold text-slate-900">
                {stockIn.code}
              </h1>

              <StockInStatusBadge status={stockIn.status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Tạo lúc {new Date(stockIn.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isDraft && (
            <Button
              onClick={() => setSubmitOpen(true)}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <Send className="mr-2 h-4 w-4" />
              Gửi duyệt
            </Button>
          )}

          {isPending && (
            <>
              <Button
                variant="outline"
                onClick={() => setRejectOpen(true)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Từ chối
              </Button>

              <Button
                onClick={() => setApproveOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Duyệt
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <StockInInfo stockIn={stockIn} />

      {/* Items */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Danh sách sản phẩm
          </h2>
        </div>

        <div className="p-6">
          <StockInItemsEditor
            items={items}
            currency={stockIn.currency}
            readOnly={!isDraft}
            onAdd={handleAdd}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        </div>
      </div>

      {/* Dialogs */}
      <StockInSubmitDialog
        stockIn={stockIn}
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={setStockIn}
      />

      <StockInApproveDialog
        stockIn={stockIn}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={setStockIn}
      />

      <StockInRejectDialog
        stockIn={stockIn}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={setStockIn}
      />
    </div>
  );
}
