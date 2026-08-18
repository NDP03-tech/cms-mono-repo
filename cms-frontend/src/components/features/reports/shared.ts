// src/components/reports/shared.ts

export type GroupBy = "day" | "week" | "month";

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  groupBy: GroupBy;
}

export function formatCurrency(value: number, currency = "VND"): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function formatPeriodLabel(iso: string, groupBy: GroupBy): string {
  const d = new Date(iso);
  if (groupBy === "month") {
    return d.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
  }
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}
