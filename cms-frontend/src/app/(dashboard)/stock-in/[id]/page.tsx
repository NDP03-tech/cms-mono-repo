// src/app/(dashboard)/stock-in/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Loader2 } from "lucide-react";

import { StockInDetail } from "@/components/features/stock-in/stock-in-detail";

import { StockIn } from "@/types/stock-in.types";

import { stockInService } from "@/services/stock-in.service";

export default function StockInDetailPage() {
  const params = useParams<{ id: string }>();

  const [stockIn, setStockIn] = useState<StockIn | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await stockInService.getById(params.id);

        setStockIn(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!stockIn) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-slate-500">
        Không tìm thấy phiếu nhập.
      </div>
    );
  }

  return <StockInDetail initialStockIn={stockIn} />;
}
