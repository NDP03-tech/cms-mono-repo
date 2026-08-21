// src/components/reports/overview-tab.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  BoxesIcon,
  PackageIcon,
  ReceiptIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { reportService } from "@/services/report.service";
import type {
  DashboardOverview,
  LowStockRow,
  SalesSummaryPoint,
  StockInSummaryPoint,
} from "@/types/report.types";
import { formatCurrency, formatNumber, formatPeriodLabel } from "./shared";
import type { ReportFilters } from "./shared";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

interface ChartPoint {
  period: string;
  nhap: number;
  xuat: number;
}

function mergeSeries(
  inPoints: StockInSummaryPoint[],
  outPoints: SalesSummaryPoint[],
  groupBy: ReportFilters["groupBy"],
): ChartPoint[] {
  const byPeriod = new Map<string, ChartPoint>();
  for (const p of inPoints) {
    byPeriod.set(p.period, {
      period: formatPeriodLabel(p.period, groupBy),
      nhap: p.value,
      xuat: 0,
    });
  }
  for (const p of outPoints) {
    const label = formatPeriodLabel(p.period, groupBy);
    const existing = [...byPeriod.values()].find((v) => v.period === label);
    if (existing) {
      existing.xuat = p.revenue;
    } else {
      byPeriod.set(p.period, { period: label, nhap: 0, xuat: p.revenue });
    }
  }
  return [...byPeriod.values()];
}

export function OverviewTab({ filters }: { filters: ReportFilters }) {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [lowStock, setLowStock] = useState<LowStockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([
      reportService.overview({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      }),
      reportService.stockInSummary(filters),
      reportService.salesSummary(filters),
      reportService.lowStock(10),
    ])
      .then(([ov, stockIn, stockOut, low]) => {
        if (cancelled) return;
        setOverview(ov);
        setChartData(
          mergeSeries(stockIn.points, stockOut.points, filters.groupBy),
        );
        setLowStock(low);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg bg-slate-100" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-lg bg-slate-100" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-slate-200">
        <TriangleAlertIcon className="h-6 w-6 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-900">
          Không tải được dữ liệu tổng quan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Tổng giá trị nhập"
          value={formatCurrency(overview.totalStockInValue)}
          icon={ArrowDownToLineIcon}
        />
        <StatCard
          label="Tổng giá trị xuất"
          value={formatCurrency(overview.totalStockOutValue)}
          icon={ArrowUpFromLineIcon}
        />
        <StatCard
          label="Số phiếu nhập"
          value={formatNumber(overview.stockInVoucherCount)}
          icon={ReceiptIcon}
        />
        <StatCard
          label="Số phiếu xuất"
          value={formatNumber(overview.stockOutVoucherCount)}
          icon={ReceiptIcon}
        />
        <StatCard
          label="Số sản phẩm đang tồn"
          value={formatNumber(overview.productsInStockCount)}
          icon={PackageIcon}
        />
        <StatCard
          label="Tổng giá trị tồn kho"
          value={formatCurrency(overview.totalInventoryValue)}
          icon={BoxesIcon}
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <p className="text-sm font-medium text-slate-900 mb-4">
          Nhập / xuất theo thời gian
        </p>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-400">
              Không có dữ liệu trong khoảng thời gian này
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
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
              <Legend />
              <Bar
                dataKey="nhap"
                name="Nhập"
                fill="#0f172a"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="xuat"
                name="Xuất"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TriangleAlertIcon className="h-4 w-4 text-amber-600" />
          <p className="text-sm font-medium text-slate-900">
            Cảnh báo tồn kho thấp / hết hàng
          </p>
        </div>
        {lowStock.length === 0 ? (
          <p className="text-xs text-slate-400">
            Không có sản phẩm nào sắp hết hoặc hết hàng
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {lowStock.slice(0, 8).map((row) => (
              <div
                key={row.productId}
                className="flex items-center justify-between py-2.5"
              >
                <div>
                  <p className="text-sm text-slate-900">{row.productName}</p>
                  <p className="text-xs text-slate-400">{row.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {formatNumber(row.quantity)}
                  </span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
