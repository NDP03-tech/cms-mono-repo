// src/components/features/stock-out/stock-out-info.tsx

import { StockOut } from "@/types/stock-out.types";

interface Props {
  stockOut: StockOut;
}

export function StockOutInfo({ stockOut }: Props) {
  const hasRecipientInfo =
    stockOut.recipientName || stockOut.recipientPhone || stockOut.note;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Thông tin phiếu xuất
        </h2>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem label="Khách hàng" value={stockOut.customerName} />

        <InfoItem
          label="Người tạo"
          value={stockOut.createdByName || stockOut.createdBy}
        />

        <InfoItem label="Tiền tệ" value={stockOut.currency} />

        <InfoItem
          label="Ngày tạo"
          value={new Date(stockOut.createdAt).toLocaleString("vi-VN")}
        />

        {stockOut.approvedAt && (
          <InfoItem
            label="Ngày duyệt"
            value={new Date(stockOut.approvedAt).toLocaleString("vi-VN")}
          />
        )}
      </div>

      {hasRecipientInfo && (
        <>
          <div className="border-t border-slate-100 px-6 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Thông tin nhận hàng
            </h3>
          </div>

          <div className="grid gap-6 p-6 pt-0 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Người nhận hàng" value={stockOut.recipientName} />
            <InfoItem label="SĐT liên hệ" value={stockOut.recipientPhone} />

            {stockOut.note && (
              <div className="sm:col-span-2 lg:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ghi chú
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-700">
                  {stockOut.note}
                </p>
              </div>
            )}
          </div>
        </>
      )}
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
