// src/components/features/stock-in/stock-in-info.tsx

import { StockIn } from "@/types/stock-in.types";

interface Props {
  stockIn: StockIn;
}

export function StockInInfo({ stockIn }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Thông tin phiếu nhập
        </h2>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem label="Nhà cung cấp" value={stockIn.supplierName} />

        <InfoItem
          label="Người tạo"
          value={stockIn.createdByName || stockIn.createdBy}
        />

        <InfoItem label="Tiền tệ" value={stockIn.currency} />

        <InfoItem
          label="Ngày tạo"
          value={new Date(stockIn.createdAt).toLocaleString("vi-VN")}
        />

        {stockIn.approvedAt && (
          <InfoItem
            label="Ngày duyệt"
            value={new Date(stockIn.approvedAt).toLocaleString("vi-VN")}
          />
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}
