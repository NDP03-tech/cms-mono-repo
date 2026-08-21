// src/components/features/inventory/inventory-balance-table.tsx
"use client";

import { Settings2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryBalance } from "@/types/inventory.types";

interface InventoryBalanceTableProps {
  balances: InventoryBalance[];
  isLoading: boolean;
  onAdjust: (balance: InventoryBalance) => void;
  canAdjust: boolean;
}

export function InventoryBalanceTable({
  balances,
  isLoading,
  onAdjust,
  canAdjust,
}: InventoryBalanceTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {[
                "SKU",
                "Tên sản phẩm",
                "Đơn vị",
                "Tồn kho",
                "Cập nhật lúc",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
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

  if (balances.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-sm font-medium text-slate-900">
            Chưa có dữ liệu tồn kho
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Dữ liệu sẽ được cập nhật sau khi duyệt phiếu nhập
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
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tên sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Đơn vị
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tồn kho
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Cập nhật lúc
              </th>
              <th className="px-4 py-3 w-[60px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {balances.map((balance) => (
              <tr
                key={balance.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {balance.productSku}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 font-medium">
                  {balance.productName}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {balance.productUnit || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      balance.quantity <= 0
                        ? "text-sm font-semibold text-red-600"
                        : balance.quantity <= 5
                          ? "text-sm font-semibold text-amber-600"
                          : "text-sm font-semibold text-slate-900"
                    }
                  >
                    {balance.quantity}
                  </span>
                  {balance.quantity <= 5 && balance.quantity > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      Sắp hết
                    </span>
                  )}
                  {balance.quantity <= 0 && (
                    <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                      Hết hàng
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(balance.updatedAt).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-3">
                  {canAdjust && (
                    <button
                      onClick={() => onAdjust(balance)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Điều chỉnh tồn kho"
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
