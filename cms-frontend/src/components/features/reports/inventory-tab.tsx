// src/components/reports/inventory-tab.tsx
"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { reportService } from "@/services/report.service";
import type {
  InventoryMovementRow,
  InventoryValuation,
  LowStockRow,
} from "@/types/report.types";
import { formatCurrency, formatNumber } from "./shared";
import type { ReportFilters } from "./shared";

export function InventoryTab({ filters }: { filters: ReportFilters }) {
  const [valuation, setValuation] = useState<InventoryValuation | null>(null);
  const [movement, setMovement] = useState<InventoryMovementRow[]>([]);
  const [lowStock, setLowStock] = useState<LowStockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([
      reportService.inventoryValuation(),
      reportService.inventoryMovement({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      }),
      reportService.lowStock(10),
    ])
      .then(([v, m, l]) => {
        if (cancelled) return;
        setValuation(v);
        setMovement(m);
        setLowStock(l);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [filters.fromDate, filters.toDate]);

  const outOfStock = lowStock.filter((r) => r.status === "out").length;
  const low = lowStock.filter((r) => r.status === "low").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg bg-slate-100" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-lg bg-slate-100" />
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-900">
          Không tải được dữ liệu tồn kho
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Tổng SKU đang tồn
          </p>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {formatNumber(valuation.rows.length)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Tổng giá trị tồn
          </p>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {formatCurrency(valuation.totalValue)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Sắp hết hàng
          </p>
          <p className="text-2xl font-semibold text-amber-600 mt-3">
            {formatNumber(low)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Hết hàng
          </p>
          <p className="text-2xl font-semibold text-red-600 mt-3">
            {formatNumber(outOfStock)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-sm font-medium text-slate-900">
            Nhập - Xuất - Tồn theo sản phẩm
          </p>
        </div>
        {movement.length === 0 ? (
          <p className="text-xs text-slate-400 px-4 py-6 text-center">
            Chưa có dữ liệu
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Tồn đầu
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Nhập
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Xuất
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Tồn cuối
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movement.map((row) => (
                  <tr
                    key={row.productId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {row.productName}
                      <span className="block text-xs text-slate-400">
                        {row.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right">
                      {formatNumber(row.openingQuantity)}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 text-right">
                      +{formatNumber(row.inQuantity)}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right">
                      -{formatNumber(row.outQuantity)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">
                      {formatNumber(row.closingQuantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-sm font-medium text-slate-900">
            Sản phẩm sắp hết / hết hàng
          </p>
        </div>
        {lowStock.length === 0 ? (
          <p className="text-xs text-slate-400 px-4 py-6 text-center">
            Không có sản phẩm nào sắp hết hoặc hết hàng
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStock.map((row) => (
                <tr
                  key={row.productId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {row.productName}
                    <span className="block text-xs text-slate-400">
                      {row.sku}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {formatNumber(row.quantity)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset " +
                        (row.status === "out"
                          ? "bg-red-50 text-red-600 ring-red-600/20"
                          : "bg-amber-50 text-amber-700 ring-amber-600/20")
                      }
                    >
                      {row.status === "out" ? "Hết hàng" : "Sắp hết"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
