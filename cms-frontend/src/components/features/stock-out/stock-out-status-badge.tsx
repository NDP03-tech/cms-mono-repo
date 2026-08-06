// src/components/features/stock-out/stock-out-status-badge.tsx
import { StockOutStatus } from "@/types/stock-out.types";

const statusConfig: Record<
  StockOutStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Nháp",
    className:
      "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20",
  },
  pending: {
    label: "Chờ duyệt",
    className:
      "inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20",
  },
  approved: {
    label: "Đã duyệt",
    className:
      "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  },
  rejected: {
    label: "Từ chối",
    className:
      "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20",
  },
};

export function StockOutStatusBadge({ status }: { status: StockOutStatus }) {
  const config = statusConfig[status];
  return <span className={config.className}>{config.label}</span>;
}
