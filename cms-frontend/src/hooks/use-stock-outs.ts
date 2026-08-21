"use client";

import { useCallback, useEffect, useState } from "react";

import { stockOutService } from "@/services/stock-out.service";
import type { StockOut, StockOutFilters } from "@/types/stock-out.types";

export function useStockOuts(filters?: StockOutFilters) {
  const [data, setData] = useState<StockOut[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      setData(await stockOutService.list(filters));
    } catch (error) {
      console.error("Failed to load stock-outs:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => void refetch(), 0);

    return () => clearTimeout(timer);
  }, [refetch]);

  return { data, loading, refetch };
}
