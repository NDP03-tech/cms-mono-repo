"use client";

import { Package } from "lucide-react";
import { StockOutStatusBadge } from "./stock-out-status-badge";
import { StockOutActions } from "./stock-out-actions";
import type { StockOut } from "@/types/stock-out.types";

const currency = (n: number, code: string) =>
  new Intl.NumberFormat("vi-VN").format(n) +
  (code === "VND" ? " ₫" : ` ${code}`);
const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

interface StockOutTableProps {
  stockOuts: StockOut[];
  isLoading?: boolean;
  onView: (stockOut: StockOut) => void;
  onSubmit?: (stockOut: StockOut) => void;
  onApprove?: (stockOut: StockOut) => void;
  onReject?: (stockOut: StockOut) => void;
  /** Ẩn cột khách hàng khi bảng đã nằm trong ngữ cảnh của 1 khách hàng cụ thể (customer-detail). */
  showCustomerColumn?: boolean;
}

export function StockOutTable({
  stockOuts,
  isLoading = false,
  onView,
  onSubmit,
  onApprove,
  onReject,
  showCustomerColumn = true,
}: StockOutTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Mã phiếu
              </th>
              {showCustomerColumn && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Khách hàng
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                SL sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide w-[140px]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td
                    colSpan={showCustomerColumn ? 7 : 6}
                    className="px-4 py-3"
                  >
                    <div className="h-5 w-full rounded bg-slate-100 animate-pulse" />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              stockOuts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td
                    className="px-4 py-3 text-sm font-medium text-slate-900 cursor-pointer"
                    onClick={() => onView(s)}
                  >
                    {s.code}
                  </td>
                  {showCustomerColumn && (
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {s.customerName ?? s.customerId}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {s.items.length}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {currency(s.totalAmount, s.currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StockOutStatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StockOutActions
                      stockOut={s}
                      onView={onView}
                      onSubmit={onSubmit}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && stockOuts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-900">
            Chưa có phiếu xuất nào
          </p>
          <p className="text-xs text-slate-400 mt-1">Thử điều chỉnh bộ lọc</p>
        </div>
      )}
    </div>
  );
}
