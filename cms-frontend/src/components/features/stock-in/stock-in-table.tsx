// src/components/features/stock-in/stock-in-table.tsx

"use client";

import { Loader2, PackageOpen } from "lucide-react";

import { StockIn } from "@/types/stock-in.types";

import { StockInStatusBadge } from "./stock-in-status-badge";
import { StockInActions } from "./stock-in-actions";

interface Props {
  stockIns: StockIn[];
  isLoading?: boolean;

  onView: (stockIn: StockIn) => void;
  onSubmit?: (stockIn: StockIn) => void;
  onApprove?: (stockIn: StockIn) => void;
  onReject?: (stockIn: StockIn) => void;
}

export function StockInTable({
  stockIns,
  isLoading = false,
  onView,
  onSubmit,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Mã phiếu
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Nhà cung cấp
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Người tạo
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Tổng tiền
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Trạng thái
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="h-48">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải...
                  </div>
                </td>
              </tr>
            ) : stockIns.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-48">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <PackageOpen className="mb-3 h-8 w-8" />

                    <p className="text-sm font-medium">Chưa có phiếu nhập</p>

                    <p className="mt-1 text-xs">
                      Tạo phiếu nhập đầu tiên để bắt đầu.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              stockIns.map((stockIn) => (
                <tr
                  key={stockIn.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onView(stockIn)}
                      className="font-mono text-sm font-medium text-slate-900 hover:underline"
                    >
                      {stockIn.code}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-700">
                        {stockIn.supplierName}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {stockIn.items?.length ?? 0} sản phẩm
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-slate-600">
                      {stockIn.createdByName || stockIn.createdBy}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">
                      {stockIn.totalAmount.toLocaleString("vi-VN")}{" "}
                      {stockIn.currency}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <StockInStatusBadge status={stockIn.status} />
                  </td>

                  <td className="px-4 py-3">
                    <StockInActions
                      stockIn={stockIn}
                      onView={onView}
                      onSubmit={onSubmit}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
