// src/components/features/stock-in/stock-in-item-row.tsx

"use client";

import { Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { StockInItemDraft } from "@/types/stock-in.types";

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

export function StockInItemRow({
  item,
  currency,
  readOnly = false,
  onChange,
  onRemove,
}: Props) {
  const total = item.quantity * item.unitPrice;

  return (
    <div className="grid grid-cols-[1fr_100px_150px_150px_40px] items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
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
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) =>
            onChange(item.tempId, "quantity", Number(e.target.value))
          }
          className="h-9"
        />
      )}

      {readOnly ? (
        <span className="text-sm text-slate-600">
          {item.unitPrice.toLocaleString("vi-VN")} {currency}
        </span>
      ) : (
        <Input
          type="number"
          min={0}
          value={item.unitPrice}
          onChange={(e) =>
            onChange(item.tempId, "unitPrice", Number(e.target.value))
          }
          className="h-9"
        />
      )}

      <span className="text-sm font-medium text-slate-700">
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
