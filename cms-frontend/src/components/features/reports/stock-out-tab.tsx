// src/components/reports/stock-out-tab.tsx
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
  SalesSummary,
  TopCustomerRow,
  TopProductRow,
} from "@/types/report.types";
import { formatCurrency, formatNumber, formatPeriodLabel } from "./shared";
import type { ReportFilters } from "./shared";

export function StockOutTab({ filters }: { filters: ReportFilters }) {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomerRow[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([
      reportService.salesSummary(filters),
      reportService.topCustomers(10),
      reportService.topProducts(10),
    ])
      .then(([s, cust, prod]) => {
        if (cancelled) return;
        setSummary(s);
        setTopCustomers(cust);
        setTopProducts(prod);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full rounded-lg bg-slate-100" />
          <Skeleton className="h-64 w-full rounded-lg bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-900">
          Không tải được dữ liệu xuất kho
        </p>
      </div>
    );
  }

  const chartData = summary.points.map((p) => ({
    period: formatPeriodLabel(p.period, filters.groupBy),
    revenue: p.revenue,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Tổng giá trị xuất
          </p>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Số phiếu xuất
          </p>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {formatNumber(summary.totalOrders)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <p className="text-sm font-medium text-slate-900 mb-4">
          Xuất theo thời gian
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
              <Tooltip
                formatter={(value) =>
                  formatCurrency(
                    typeof value === "number" ? value : Number(value ?? 0),
                  )
                }
              />
              <Bar
                dataKey="revenue"
                name="Doanh thu"
                fill="#0f172a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-900">Top khách hàng</p>
          </div>
          {topCustomers.length === 0 ? (
            <p className="text-xs text-slate-400 px-4 py-6 text-center">
              Chưa có dữ liệu
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCustomers.map((c) => (
                  <tr
                    key={c.customerId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {c.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right">
                      {formatCurrency(c.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-900">Top sản phẩm</p>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 px-4 py-6 text-center">
              Chưa có dữ liệu
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    SL
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p) => (
                  <tr
                    key={p.productId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {p.productName}
                      <span className="block text-xs text-slate-400">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right">
                      {formatNumber(p.totalQuantity)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right">
                      {formatCurrency(p.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
