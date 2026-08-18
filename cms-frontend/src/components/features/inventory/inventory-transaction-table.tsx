// src/components/features/inventory/inventory-transaction-table.tsx
"use client";

import Link from "next/link";
import { ArrowDownCircle, ArrowUpCircle, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InventoryTransaction,
  InventoryTransactionType,
} from "@/types/inventory.types";

const typeConfig: Record<
  InventoryTransactionType,
  {
    label: string;
    textClassName: string;
    sign: string;
    icon: typeof ArrowDownCircle;
  }
> = {
  "stock-in": {
    label: "Nhập",
    textClassName: "text-emerald-600",
    sign: "+",
    icon: ArrowDownCircle,
  },
  "stock-out": {
    label: "Xuất",
    textClassName: "text-blue-600",
    sign: "-",
    icon: ArrowUpCircle,
  },
  adjustment: {
    label: "Điều chỉnh",
    textClassName: "text-amber-600",
    sign: "±",
    icon: RotateCcw,
  },
};

// Dùng khi tx.type trả về giá trị không nằm trong typeConfig (BE thêm loại
// giao dịch mới, dữ liệu null/sai định dạng...) — tránh crash toàn bảng chỉ
// vì 1 dòng dữ liệu lạ.
const fallbackConfig = {
  label: "Khác",
  textClassName: "text-slate-500",
  sign: "",
  icon: RotateCcw,
};

// referenceType không có trong InventoryTransactionType (chỉ 3 giá trị đó)
// nên khai riêng phần route/label cho tham chiếu để dễ mở rộng sau này.
const referenceConfig: Record<string, { label: string; href: string }> = {
  stock_in: { label: "Xem phiếu nhập", href: "/stock-in" },
  stock_out: { label: "Xem phiếu xuất", href: "/stock-out" },
  adjustment: { label: "Xem điều chỉnh", href: "/inventory/adjustments" },
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
              {["Sản phẩm", "Số lượng", "Tham chiếu", "Thời gian"].map((h) => (
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
                {Array.from({ length: 4 }).map((_, j) => (
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
              // InventoryTransactionType enum ở BE dùng "stock-in"/"stock-out"
              // (gạch nối), đã xác nhận và khớp với typeConfig phía trên.
              // .trim() chỉ để phòng khoảng trắng thừa từ dữ liệu cũ.
              const normalizedType = String(tx.type).trim();
              const config =
                typeConfig[normalizedType as InventoryTransactionType] ??
                fallbackConfig;
              const Icon = config.icon;
              const normalizedRefType = tx.referenceType
                ? String(tx.referenceType).toLowerCase().trim()
                : undefined;
              const ref = normalizedRefType
                ? referenceConfig[normalizedRefType]
                : undefined;

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
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${config.textClassName}`}
                    >
                      <Icon className="h-4 w-4" />
                      {config.label} {config.sign}
                      {tx.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {ref && tx.referenceId ? (
                      <Link
                        href={`${ref.href}/${tx.referenceId}`}
                        className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900 hover:decoration-slate-500"
                      >
                        {ref.label}
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
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
