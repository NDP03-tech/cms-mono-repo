// src/components/features/stock-in/stock-in-items-editor.tsx

"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StockInItemDraft } from "@/types/stock-in.types";

import { StockInItemRow } from "./stock-in-item-row";
import { StockInProductPicker } from "./stock-in-product-picker";

import { Product } from "@/types/product.types";

interface Props {
  items: StockInItemDraft[];

  currency: string;

  readOnly?: boolean;

  onAdd: (product: Product) => void;

  onChange: (
    itemId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => void;

  onRemove: (itemId: string) => void;
}

export function StockInItemsEditor({
  items,
  currency,
  readOnly = false,
  onAdd,
  onChange,
  onRemove,
}: Props) {
  const excludeIds = useMemo(
    () => items.map((item) => item.productId),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div>
          <StockInProductPicker excludeIds={excludeIds} onSelect={onAdd} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1fr_100px_150px_150px_40px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sản phẩm
          </span>

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            SL
          </span>

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Đơn giá
          </span>

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Thành tiền
          </span>

          {!readOnly && <span />}
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center text-center">
            <Plus className="mb-2 h-6 w-6 text-slate-300" />

            <p className="text-sm text-slate-500">Chưa có sản phẩm</p>

            {!readOnly && (
              <p className="mt-1 text-xs text-slate-400">
                Tìm và thêm sản phẩm ở phía trên
              </p>
            )}
          </div>
        ) : (
          items.map((item) => (
            <StockInItemRow
              key={item.tempId}
              item={item}
              currency={currency}
              readOnly={readOnly}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))
        )}

        {items.length > 0 && (
          <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Tổng tiền</p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {total.toLocaleString("vi-VN")} {currency}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
