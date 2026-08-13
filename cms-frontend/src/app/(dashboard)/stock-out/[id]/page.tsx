// src/app/(dashboard)/stock-out/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { StockOutDetail } from "@/components/features/stock-out/stock-out-detail";
import { StockOut } from "@/types/stock-out.types";
import { stockOutService } from "@/services/stock-out.service";
import { customerService } from "@/services/customer.service";
import { withCustomerName } from "@/lib/enrich-stock-out";

// TODO: thay bằng session hook thật — quyết định có hiện nút Duyệt/Từ chối hay không.
const CURRENT_USER_IS_ADMIN = true;

export default function StockOutDetailPage() {
  const params = useParams<{ id: string }>();

  const [stockOut, setStockOut] = useState<StockOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await stockOutService.getById(params.id);

        let enriched = data;
        try {
          const customer = await customerService.getById(data.customerId);
          enriched = withCustomerName(data, [customer]);
        } catch {
          // Khách hàng có thể đã bị xoá — vẫn hiển thị phiếu, chỉ thiếu tên.
        }

        setStockOut(enriched);
      } catch (err) {
        console.error("Failed to load stock-out:", err);
        setError("Không tìm thấy phiếu xuất hoặc có lỗi xảy ra.");
        setStockOut(null);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Đang tải...
      </div>
    );
  }

  if (error || !stockOut) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error ?? "Không tìm thấy phiếu xuất."}
      </div>
    );
  }

  return (
    <StockOutDetail
      initialStockOut={stockOut}
      canApprove={CURRENT_USER_IS_ADMIN}
    />
  );
}
