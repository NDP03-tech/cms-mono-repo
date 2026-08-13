import type { StockOutStatus } from "@/types/stock-out.types";

const STATUS_STYLES: Record<StockOutStatus, string> = {
  draft: "bg-blue-50 text-blue-700 ring-blue-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-red-50 text-red-600 ring-red-600/20",
};

const STATUS_LABELS: Record<StockOutStatus, string> = {
  draft: "Nháp",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export function StockOutStatusBadge({ status }: { status: StockOutStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
