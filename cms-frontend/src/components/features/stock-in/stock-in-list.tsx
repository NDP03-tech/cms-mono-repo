// src/components/features/stock-in/stock-in-list.tsx

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StockInTable } from "./stock-in-table";

import { StockIn, StockInStatus } from "@/types/stock-in.types";

import { stockInService } from "@/services/stock-in.service";

export function StockInList() {
  const router = useRouter();

  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchStockIns = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await stockInService.list();
      setStockIns(data ?? []);
    } catch (error) {
      console.error("Failed to load stock-ins", error);
      setStockIns([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockIns();
  }, [fetchStockIns]);

  const filteredStockIns = useMemo(() => {
    let result = [...stockIns];

    const q = search.trim().toLowerCase();

    if (q) {
      result = result.filter((stockIn) => {
        return (
          stockIn.code.toLowerCase().includes(q) ||
          stockIn.supplierName?.toLowerCase().includes(q) ||
          stockIn.createdByName?.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (stockIn) => stockIn.status === (statusFilter as StockInStatus),
      );
    }

    return result;
  }, [stockIns, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Phiếu nhập kho
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý phiếu nhập hàng từ nhà cung cấp
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800"
        >
          <Link href="/stock-in/new">
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu nhập
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã phiếu, nhà cung cấp, người tạo..."
            className="h-9 pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[170px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>

            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-slate-400">
          {filteredStockIns.length} phiếu
        </span>
      </div>

      <StockInTable
        stockIns={filteredStockIns}
        isLoading={isLoading}
        onView={(stockIn) => router.push(`/stock-in/${stockIn.id}`)}
        onSubmit={(stockIn) => router.push(`/stock-in/${stockIn.id}`)}
        onApprove={(stockIn) => router.push(`/stock-in/${stockIn.id}`)}
        onReject={(stockIn) => router.push(`/stock-in/${stockIn.id}`)}
      />
    </div>
  );
}
