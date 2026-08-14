// src/components/features/stock-out/stock-out-detail.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Send, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StockOut, StockOutItemDraft } from "@/types/stock-out.types";
import { Product } from "@/types/product.types";
import { stockOutService } from "@/services/stock-out.service";
import { productService } from "@/services/product.service";
import { withProductNames } from "@/lib/enrich-stock-out";

import { StockOutStatusBadge } from "./stock-out-status-badge";
import { StockOutInfo } from "./stock-out-info";
import { StockOutItemsEditor } from "./stock-out-items-editor";
import { StockOutSubmitDialog } from "./stock-out-submit-dialog";
import { StockOutApproveDialog } from "./stock-out-approve-dialog";
import { StockOutRejectDialog } from "./stock-out-reject-dialog";

interface Props {
  initialStockOut: StockOut;
}

function toDrafts(stockOut: StockOut): StockOutItemDraft[] {
  return (stockOut.items ?? []).map((item) => ({
    tempId: item.id,
    productId: item.productId,
    productName: item.productName ?? item.productId,
    productSku: item.productSku,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    currency: item.currency,
  }));
}

export function StockOutDetail({ initialStockOut }: Props) {
  const [rawStockOut, setRawStockOut] = useState<StockOut>(initialStockOut);
  const [products, setProducts] = useState<Product[]>([]);

  // StockOutItemOutput ở BE chưa trả productName/productSku (khác stock-in),
  // nên join tên sản phẩm ở đây bằng danh sách product đã fetch sẵn.
  const stockOut = useMemo<StockOut>(
    () => ({
      ...rawStockOut,
      items: withProductNames(rawStockOut.items, products),
    }),
    [rawStockOut, products],
  );

  const [items, setItems] = useState<StockOutItemDraft[]>(() =>
    toDrafts(stockOut),
  );

  useEffect(() => {
    setItems(toDrafts(stockOut));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawStockOut, products]);

  useEffect(() => {
    let alive = true;

    productService
      .list()
      .then((data) => {
        if (alive) setProducts(data ?? []);
      })
      .catch((err) => {
        console.error("Load products for enrichment failed:", err);
      });

    return () => {
      alive = false;
    };
  }, []);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const isDraft = stockOut.status === "draft";
  const isPending = stockOut.status === "pending";

  async function handleAdd(product: Product) {
    try {
      await stockOutService.addItem(stockOut.id, {
        productId: product.id,
        quantity: 1,
        unitPrice: product.costPrice,
        currency: product.currency,
      });
      const fresh = await stockOutService.getById(stockOut.id);
      setRawStockOut(fresh);
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

      await stockOutService.updateItem(stockOut.id, itemId, {
        itemId,
        quantity: field === "quantity" ? value : item.quantity,
        unitPrice: field === "unitPrice" ? value : item.unitPrice,
        currency: item.currency,
      });
    } catch (error) {
      console.error("Update item failed:", error);
      setItems(toDrafts(stockOut));
    }
  }

  async function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((i) => i.tempId !== itemId));

    try {
      await stockOutService.removeItem(stockOut.id, itemId);
      const fresh = await stockOutService.getById(stockOut.id);
      setRawStockOut(fresh);
    } catch (error) {
      console.error("Remove item failed:", error);
      setItems(toDrafts(stockOut));
    }
  }

  function handleSuccess(fresh: StockOut) {
    setRawStockOut(fresh);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/stock-out"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-lg font-semibold text-slate-900">
                {stockOut.code}
              </h1>
              <StockOutStatusBadge status={stockOut.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Tạo lúc {new Date(stockOut.createdAt).toLocaleString("vi-VN")}
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
      <StockOutInfo stockOut={stockOut} />

      {/* Items */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Danh sách sản phẩm
          </h2>
        </div>
        <div className="p-6">
          <StockOutItemsEditor
            items={items}
            currency={stockOut.currency}
            readOnly={!isDraft}
            onAdd={handleAdd}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        </div>
      </div>

      {/* Dialogs */}
      <StockOutSubmitDialog
        stockOut={stockOut}
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={handleSuccess}
      />

      <StockOutApproveDialog
        stockOut={stockOut}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={handleSuccess}
      />

      <StockOutRejectDialog
        stockOut={stockOut}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
