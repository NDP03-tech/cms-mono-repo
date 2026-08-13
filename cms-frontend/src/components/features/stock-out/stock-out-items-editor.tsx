// src/components/features/stock-out/stock-out-items-editor.tsx
//
// ĐÃ VIẾT LẠI HOÀN TOÀN. Bản bạn upload trước đó thực ra là bản API-backed
// (đã đổi tên sang stock-out-detail-items-editor.tsx). File này giờ đúng như
// stock-out-form.tsx đang import: quản lý item hoàn toàn ở LOCAL STATE, dùng
// cho trang /stock-out/new khi phiếu CHƯA được tạo trên BE (chưa có stockOutId).
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSelect } from "./product-select";
import type { StockOutItemDraft } from "@/types/stock-out.types";
import type { Product } from "@/types/product.types";

const currency = (n: number, code: string) =>
  new Intl.NumberFormat("vi-VN").format(n) +
  (code === "VND" ? " ₫" : ` ${code}`);

interface StockOutItemsEditorProps {
  items: StockOutItemDraft[];
  currency: string;
  onAdd: (product: Product) => void;
  onChange: (
    itemId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => void;
  onRemove: (itemId: string) => void;
}

export function StockOutItemsEditor({
  items,
  currency: curr,
  onAdd,
  onChange,
  onRemove,
}: StockOutItemsEditorProps) {
  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <div className="space-y-3">
      <ProductSelect
        onSelect={onAdd}
        excludeIds={items.map((i) => i.productId)}
      />

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[110px]">
                  SL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[150px]">
                  Đơn giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide w-[150px]">
                  Thành tiền
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide w-[60px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr
                  key={item.tempId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-900">{item.productName}</p>
                    {item.productSku && (
                      <p className="text-xs text-slate-400">
                        {item.productSku}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        onChange(
                          item.tempId,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      className="h-8 w-20 border-slate-200 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) =>
                        onChange(
                          item.tempId,
                          "unitPrice",
                          Number(e.target.value),
                        )
                      }
                      className="h-8 w-28 border-slate-200 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {currency(item.quantity * item.unitPrice, item.currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-md"
                      onClick={() => onRemove(item.tempId)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-400">
            Chưa có sản phẩm nào
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Tổng cộng
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {currency(total, curr)}
        </span>
      </div>
    </div>
  );
}
