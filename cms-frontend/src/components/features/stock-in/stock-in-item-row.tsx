// src/components/features/stock-in/stock-in-item-row.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { StockInItemDraft } from "@/types/stock-in.types";

// Phải TRÙNG với GRID_COLS trong stock-in-items-editor.tsx để header và
// từng row luôn thẳng hàng. Nếu đổi 1 bên nhớ đổi cả 2.
const GRID_COLS = "grid-cols-[1fr_140px_170px_150px_40px]";

interface Props {
  item: StockInItemDraft;
  currency: string;
  readOnly?: boolean;

  onChange: (
    id: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => void;

  onRemove: (id: string) => void;
}

/** Chỉ giữ lại chữ số từ chuỗi nhập vào (bỏ khoảng trắng, chấm, phẩy...) */
function toDigits(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

/** Format chuỗi số thô thành dạng có dấu cách nghìn kiểu vi-VN: "15000" -> "15 000" */
function formatThousands(digits: string): string {
  if (!digits) return "";
  return Number(digits).toLocaleString("vi-VN");
}

export function StockInItemRow({
  item,
  currency,
  readOnly = false,
  onChange,
  onRemove,
}: Props) {
  const total = item.quantity * item.unitPrice;

  // Text hiển thị trong input SL và Đơn giá được quản lý bằng state riêng
  // (không bind thẳng vào item.quantity/item.unitPrice) để người dùng có thể
  // xóa trắng ô và gõ số mới mà không bị component ép quay về giá trị cũ
  // (vd. về lại 1) ngay giữa lúc đang gõ.
  const [quantityText, setQuantityText] = useState(String(item.quantity));
  const [priceText, setPriceText] = useState(
    formatThousands(String(item.unitPrice)),
  );

  const quantityFocused = useRef(false);
  const priceFocused = useRef(false);

  // Đồng bộ lại từ props khi giá trị đổi từ bên ngoài (vd. reset form),
  // nhưng KHÔNG ghi đè trong lúc người dùng đang gõ trong chính ô đó.
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
    // Cho phép rỗng lúc đang gõ, chỉ báo lên cha số hợp lệ (0 nếu rỗng)
    // để "Thành tiền" cập nhật theo thời gian thực mà không ép về 1.
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
    // Format lại có dấu cách nghìn ngay khi gõ, ví dụ "15000" -> "15 000"
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
    <div
      className={`grid ${GRID_COLS} items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0`}
    >
      <div>
        <p className="text-sm font-medium text-slate-800">{item.productName}</p>

        <p className="mt-1 font-mono text-xs text-slate-400">
          {item.productSku}
        </p>
      </div>

      {readOnly ? (
        <span className="text-sm text-slate-600">{item.quantity}</span>
      ) : (
        <Input
          type="text"
          inputMode="numeric"
          value={quantityText}
          onFocus={() => {
            quantityFocused.current = true;
          }}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={handleQuantityBlur}
          className="h-9"
        />
      )}

      {readOnly ? (
        <span className="text-right text-sm text-slate-600">
          {item.unitPrice.toLocaleString("vi-VN")} {currency}
        </span>
      ) : (
        <Input
          type="text"
          inputMode="numeric"
          value={priceText}
          onFocus={() => {
            priceFocused.current = true;
          }}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={handlePriceBlur}
          className="h-9 text-right tabular-nums"
        />
      )}

      <span className="text-right text-sm font-medium text-slate-700 tabular-nums">
        {total.toLocaleString("vi-VN")} {currency}
      </span>

      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.tempId)}
          className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
