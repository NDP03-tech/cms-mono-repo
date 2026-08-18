// src/components/reports/stock-in-tab.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { reportService } from "@/services/report.service";
import type {
  StockInBySupplierRow,
  StockInSummary,
} from "@/types/report.types";
import { formatCurrency, formatNumber, formatPeriodLabel } from "./shared";
import type { ReportFilters } from "./shared";

export function StockInTab({ filters }: { filters: ReportFilters }) {
  const [summary, setSummary] = useState<StockInSummary | null>(null);
  const [bySupplier, setBySupplier] = useState<StockInBySupplierRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([
      reportService.stockInSummary(filters),
      reportService.stockInBySupplier(10),
    ])
      .then(([s, sup]) => {
        if (cancelled) return;
        setSummary(s);
        setBySupplier(sup);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [filters.fromDate, filters.toDate, filters.groupBy]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 w-full rounded-lg bg-slate-100" />
        <Skeleton className="h-64 w-full rounded-lg bg-slate-100" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-900">
          Không tải được dữ liệu nhập kho
        </p>
      </div>
    );
  }

  const chartData = summary.points.map((p) => ({
    period: formatPeriodLabel(p.period, filters.groupBy),
    value: p.value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Tổng giá trị nhập
          </p>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {formatCurrency(summary.totalValue)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Số phiếu nhập
          </p>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {formatNumber(summary.totalVouchers)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <p className="text-sm font-medium text-slate-900 mb-4">
          Nhập theo thời gian
        </p>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-400">
              Không có dữ liệu trong khoảng thời gian này
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("vi-VN", {
                    notation: "compact",
                  }).format(v)
                }
              />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar
                dataKey="value"
                name="Giá trị nhập"
                fill="#0f172a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-sm font-medium text-slate-900">
            Nhập theo nhà cung cấp
          </p>
        </div>
        {bySupplier.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Nhà cung cấp
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Số phiếu
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Giá trị nhập
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bySupplier.map((row) => (
                <tr
                  key={row.supplierId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {row.supplierName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {formatNumber(row.voucherCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {formatCurrency(row.value)}
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
