// src/components/features/stock-out/stock-out-items-editor.tsx
//
// Quản lý item hoàn toàn ở LOCAL STATE, dùng cho trang /stock-out/new khi
// phiếu CHƯA được tạo trên BE (chưa có stockOutId).
"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSelect } from "./product-select";
import type { StockOutItemDraft } from "@/types/stock-out.types";
import type { Product } from "@/types/product.types";

const currency = (n: number, code: string) =>
  new Intl.NumberFormat("vi-VN").format(n) +
  (code === "VND" ? " ₫" : ` ${code}`);

/** Chỉ giữ lại chữ số từ chuỗi nhập vào (bỏ khoảng trắng, chấm, phẩy...) */
function toDigits(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

/** "15000" -> "15 000" */
function formatThousands(digits: string): string {
  if (!digits) return "";
  return Number(digits).toLocaleString("vi-VN");
}

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
                <StockOutItemRow
                  key={item.tempId}
                  item={item}
                  onChange={onChange}
                  onRemove={onRemove}
                />
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

interface StockOutItemRowProps {
  item: StockOutItemDraft;
  onChange: (
    itemId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => void;
  onRemove: (itemId: string) => void;
}

function StockOutItemRow({ item, onChange, onRemove }: StockOutItemRowProps) {
  // State text riêng cho từng ô, không bind thẳng vào item.quantity /
  // item.unitPrice — nhờ vậy có thể xóa trắng và gõ số mới mà không bị
  // component cha (Math.max(1, value) trong stock-out-form.tsx) ép ngược
  // về giá trị cũ ngay giữa lúc đang gõ.
  const [quantityText, setQuantityText] = useState(String(item.quantity));
  const [priceText, setPriceText] = useState(
    formatThousands(String(item.unitPrice)),
  );

  const quantityFocused = useRef(false);
  const priceFocused = useRef(false);

  useEffect(() => {
    if (!quantityFocused.current) {
      setQuantityText(String(item.quantity));
    }
  }, [item.quantity]);

  useEffect(() => {
    if (!priceFocused.current) {
      setPriceText(formatThousands(String(item.unitPrice)));
    }
  }, [item.unitPrice]);

  const handleQuantityChange = (raw: string) => {
    const digits = toDigits(raw);
    setQuantityText(digits);
    onChange(item.tempId, "quantity", digits === "" ? 0 : Number(digits));
  };

  const handleQuantityBlur = () => {
    quantityFocused.current = false;
    const parsed = Number(quantityText);
    const safe = quantityText === "" || parsed < 1 ? 1 : parsed;
    setQuantityText(String(safe));
    onChange(item.tempId, "quantity", safe);
  };

  const handlePriceChange = (raw: string) => {
    const digits = toDigits(raw);
    setPriceText(formatThousands(digits));
    onChange(item.tempId, "unitPrice", digits === "" ? 0 : Number(digits));
  };

  const handlePriceBlur = () => {
    priceFocused.current = false;
    const digits = toDigits(priceText);
    const safe = digits === "" ? 0 : Number(digits);
    setPriceText(formatThousands(String(safe)));
    onChange(item.tempId, "unitPrice", safe);
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm text-slate-900">{item.productName}</p>
        {item.productSku && (
          <p className="text-xs text-slate-400">{item.productSku}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <Input
          type="text"
          inputMode="numeric"
          value={quantityText}
          onFocus={() => {
            quantityFocused.current = true;
          }}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={handleQuantityBlur}
          className="h-8 w-20 border-slate-200 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <Input
          type="text"
          inputMode="numeric"
          value={priceText}
          onFocus={() => {
            priceFocused.current = true;
          }}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={handlePriceBlur}
          className="h-8 w-28 border-slate-200 text-sm text-right tabular-nums"
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
  );
}
