"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { stockInService } from "@/services/stock-in.service";
import { StockIn } from "@/types/stock-in.types";
import { Button } from "@/components/ui/button";
import { StockInTable } from "./stock-in-table";

export function StockInList() {
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchStockIns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await stockInService.list();
      setStockIns(data ?? []);
    } catch (err) {
      console.error("Failed to load stock-ins", err);
      setError("Không thể tải danh sách phiếu nhập. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockIns();
  }, [fetchStockIns]);

  const handleView = useCallback(
    (stockIn: StockIn) => {
      router.push(`/stock-in/${stockIn.id}`);
    },
    [router],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Phiếu nhập</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh sách phiếu nhập hàng.
          </p>
        </div>

        <Button type="button" onClick={() => router.push("/stock-in/new")}>
          Thêm phiếu nhập
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <StockInTable
        stockIns={stockIns}
        isLoading={isLoading}
        onView={handleView}
      />
    </div>
  );
}
