// src/components/features/stock-in/stock-in-detail.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Send, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StockIn, StockInItemDraft } from "@/types/stock-in.types";
import { Product } from "@/types/product.types";
import { stockInService } from "@/services/stock-in.service";

import { StockInStatusBadge } from "./stock-in-status-badge";
import { StockInInfo } from "./stock-in-info";
import { StockInItemsEditor } from "./stock-in-items-editor";
import { StockInSubmitDialog } from "./stock-in-submit-dialog";
import { StockInApproveDialog } from "./stock-in-approve-dialog";
import { StockInRejectDialog } from "./stock-in-reject-dialog";

interface Props {
  initialStockIn: StockIn;
}

export function StockInDetail({ initialStockIn }: Props) {
  const [stockIn, setStockIn] = useState<StockIn>(initialStockIn);
  const [items, setItems] = useState<StockInItemDraft[]>(
    (initialStockIn.items ?? []).map((item) => ({
      tempId: item.id,
      productId: item.productId,
      productName: item.productName,
      productSku: item.productSku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      currency: item.currency,
    })),
  );

  // ← Thêm các state còn thiếu vào đây
  const [submitOpen, setSubmitOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const isDraft = stockIn.status === "draft";
  const isPending = stockIn.status === "pending";

  async function handleAdd(product: Product) {
    try {
      await stockInService.addItem(stockIn.id, {
        productId: product.id,
        quantity: 1,
        unitPrice: product.costPrice,
        currency: product.currency,
      });
      const fresh = await stockInService.getById(stockIn.id);
      setStockIn(fresh);
      setItems(
        (fresh.items ?? []).map((item) => ({
          tempId: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
        })),
      );
    } catch (error) {
      console.error("Add item failed:", error);
    }
  }

  async function handleChange(
    itemId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.tempId === itemId ? { ...item, [field]: value } : item,
      ),
    );

    try {
      const item = items.find((i) => i.tempId === itemId);
      if (!item) return;

      await stockInService.updateItem(stockIn.id, itemId, {
        quantity: field === "quantity" ? value : item.quantity,
        unitPrice: field === "unitPrice" ? value : item.unitPrice,
        currency: item.currency,
      });
    } catch (error) {
      console.error("Update item failed:", error);
      setItems(
        (stockIn.items ?? []).map((item) => ({
          tempId: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
        })),
      );
    }
  }

  async function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((i) => i.tempId !== itemId));

    try {
      await stockInService.removeItem(stockIn.id, itemId);
      const fresh = await stockInService.getById(stockIn.id);
      setStockIn(fresh);
    } catch (error) {
      console.error("Remove item failed:", error);
      setItems(
        (stockIn.items ?? []).map((item) => ({
          tempId: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
        })),
      );
    }
  }

  async function handleSuccess(fresh: StockIn) {
    setStockIn(fresh);
    setItems(
      (fresh.items ?? []).map((item) => ({
        tempId: item.id,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      })),
    );
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
        onSuccess={handleSuccess}
      />

      <StockInApproveDialog
        stockIn={stockIn}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={handleSuccess}
      />

      <StockInRejectDialog
        stockIn={stockIn}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
