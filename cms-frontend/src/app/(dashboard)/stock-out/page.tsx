// src/app/(dashboard)/stock-out/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockOutTable } from "@/components/features/stock-out/stock-out-table";
import { StockOut, StockOutStatus } from "@/types/stock-out.types";
import { stockOutService } from "@/services/stock-out.service";

export default function StockOutPage() {
  const [allStockOuts, setAllStockOuts] = useState<StockOut[]>([]);
  const [stockOuts, setStockOuts] = useState<StockOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchStockOuts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await stockOutService.list();
      setAllStockOuts(data ?? []);
    } catch {
      setAllStockOuts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockOuts();
  }, [fetchStockOuts]);

  useEffect(() => {
    let filtered = allStockOuts;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.status === (statusFilter as StockOutStatus),
      );
    }

    setStockOuts(filtered);
  }, [search, statusFilter, allStockOuts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Phiếu xuất kho
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý phiếu xuất hàng cho khách hàng
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Link href="/stock-out/new">
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu xuất
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo mã phiếu, khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm border-slate-200">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 ml-auto">
          {stockOuts.length} phiếu xuất
        </p>
      </div>

      <StockOutTable stockOuts={stockOuts} isLoading={isLoading} />
    </div>
  );
}
