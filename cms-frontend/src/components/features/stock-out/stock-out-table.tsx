// src/components/features/stock-out/stock-out-table.tsx
"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StockOut } from "@/types/stock-out.types";
import { StockOutStatusBadge } from "./stock-out-status-badge";

interface StockOutTableProps {
  stockOuts: StockOut[];
  isLoading: boolean;
}

export function StockOutTable({ stockOuts, isLoading }: StockOutTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {[
                "Mã phiếu",
                "Khách hàng",
                "Mặt hàng",
                "Tổng tiền",
                "Trạng thái",
                "Ngày tạo",
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
                {Array.from({ length: 7 }).map((_, j) => (
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

  if (stockOuts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">📤</span>
          </div>
          <p className="text-sm font-medium text-slate-900">
            Chưa có phiếu xuất nào
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Tạo phiếu xuất đầu tiên để bắt đầu
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
                Mã phiếu
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Mặt hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Ngày tạo
              </th>
              <th className="px-4 py-3 w-[60px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stockOuts.map((stockOut) => (
              <tr
                key={stockOut.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {stockOut.code}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {stockOut.customerName}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {stockOut.items.length} mặt hàng
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {stockOut.totalAmount.toLocaleString("vi-VN")}{" "}
                  {stockOut.currency}
                </td>
                <td className="px-4 py-3">
                  <StockOutStatusBadge status={stockOut.status} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(stockOut.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/stock-out/${stockOut.id}`}
                    className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
