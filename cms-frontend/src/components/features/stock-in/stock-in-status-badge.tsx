import { StockInStatus } from "@/types/stock-in.types";

interface Props {
  status: StockInStatus;
}

const config = {
  draft: {
    label: "Nháp",
    className: "bg-slate-100 text-slate-600",
  },

  pending: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700",
  },

  approved: {
    label: "Đã duyệt",
    className: "bg-emerald-50 text-emerald-700",
  },

  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700",
  },
};

export function StockInStatusBadge({ status }: Props) {
  const item = config[status] ?? {
    label: String(status ?? "-"),
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}
