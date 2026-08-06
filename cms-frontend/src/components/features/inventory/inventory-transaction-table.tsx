// src/components/features/inventory/inventory-transaction-table.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  InventoryTransaction,
  InventoryTransactionType,
} from "@/types/inventory.types";

const typeConfig: Record<
  InventoryTransactionType,
  { label: string; className: string; sign: string }
> = {
  stock_in: {
    label: "Nhập kho",
    className:
      "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    sign: "+",
  },
  stock_out: {
    label: "Xuất kho",
    className:
      "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20",
    sign: "-",
  },
  adjustment: {
    label: "Điều chỉnh",
    className:
      "inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20",
    sign: "±",
  },
};

interface InventoryTransactionTableProps {
  transactions: InventoryTransaction[];
  isLoading: boolean;
}

export function InventoryTransactionTable({
  transactions,
  isLoading,
}: InventoryTransactionTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["Sản phẩm", "Loại", "Số lượng", "Tham chiếu", "Thời gian"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-4 w-full bg-slate-100" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            Chưa có giao dịch nào
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Lịch sử sẽ hiển thị ở đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Loại
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tham chiếu
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const config = typeConfig[tx.type];
              return (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-700 font-medium">
                      {tx.productName}
                    </p>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {tx.productSku}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={config.className}>{config.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        tx.type === "stock_in"
                          ? "text-sm font-semibold text-emerald-600"
                          : tx.type === "stock_out"
                            ? "text-sm font-semibold text-blue-600"
                            : "text-sm font-semibold text-amber-600"
                      }
                    >
                      {config.sign}
                      {tx.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {tx.referenceType === "stock_in"
                      ? "Phiếu nhập"
                      : tx.referenceType === "stock_out"
                        ? "Phiếu xuất"
                        : "Điều chỉnh"}
                    {" · "}
                    {tx.referenceId.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(tx.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
