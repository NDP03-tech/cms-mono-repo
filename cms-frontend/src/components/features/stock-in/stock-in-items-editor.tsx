// src/components/features/stock-in/stock-in-items-editor.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSearchCombobox } from "./product-search-combobox";
import { Product } from "@/types/product.types";

export interface StockInItemDraft {
  tempId: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

interface StockInItemsEditorProps {
  items: StockInItemDraft[];
  onChange: (items: StockInItemDraft[]) => void;
  currency: string;
  readOnly?: boolean;
}

export function StockInItemsEditor({
  items,
  onChange,
  currency,
  readOnly = false,
}: StockInItemsEditorProps) {
  function handleAddProduct(product: Product) {
    const exists = items.find((i) => i.productId === product.id);
    if (exists) return;

    const newItem: StockInItemDraft = {
      tempId: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantity: 1,
      unitPrice: product.costPrice,
      currency: product.currency,
    };
    onChange([...items, newItem]);
  }

  function handleQtyChange(tempId: string, qty: number) {
    onChange(
      items.map((i) =>
        i.tempId === tempId ? { ...i, quantity: Math.max(1, qty) } : i,
      ),
    );
  }

  function handlePriceChange(tempId: string, price: number) {
    onChange(
      items.map((i) =>
        i.tempId === tempId ? { ...i, unitPrice: Math.max(0, price) } : i,
      ),
    );
  }

  function handleRemove(tempId: string) {
    onChange(items.filter((i) => i.tempId !== tempId));
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const excludeIds = items.map((i) => i.productId);

  return (
    <div className="space-y-3">
      {/* Items table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[100px]">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[140px]">
                Đơn giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[120px]">
                Thành tiền
              </th>
              {!readOnly && <th className="px-4 py-3 w-[48px]" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 4 : 5}
                  className="px-4 py-8 text-center text-xs text-slate-400"
                >
                  Chưa có sản phẩm nào. Thêm sản phẩm bên dưới.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.tempId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        {item.productName}
                      </p>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        {item.productSku}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span className="text-sm text-slate-600">
                        {item.quantity}
                      </span>
                    ) : (
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQtyChange(item.tempId, Number(e.target.value))
                        }
                        className="h-8 w-20 border-slate-200 text-sm focus-visible:ring-slate-900"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span className="text-sm text-slate-600">
                        {item.unitPrice.toLocaleString("vi-VN")}
                      </span>
                    ) : (
                      <Input
                        type="number"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) =>
                          handlePriceChange(item.tempId, Number(e.target.value))
                        }
                        className="h-8 w-32 border-slate-200 text-sm focus-visible:ring-slate-900"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {(item.quantity * item.unitPrice).toLocaleString("vi-VN")}{" "}
                    {currency}
                  </td>
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemove(item.tempId)}
                        className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add product row */}
      {!readOnly && (
        <ProductSearchCombobox
          onSelect={handleAddProduct}
          excludeIds={excludeIds}
        />
      )}

      {/* Total */}
      {items.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-white rounded-lg border border-slate-200 px-6 py-3 flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tổng tiền
            </span>
            <span className="text-base font-semibold text-slate-900">
              {total.toLocaleString("vi-VN")} {currency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
