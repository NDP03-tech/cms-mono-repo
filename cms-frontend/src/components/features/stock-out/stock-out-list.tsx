// src/components/features/stock-out/stock-out-list.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { stockOutService } from "@/services/stock-out.service";
import { customerService } from "@/services/customer.service";
import { StockOut, StockOutStatus } from "@/types/stock-out.types";
import { withCustomerNames } from "@/lib/enrich-stock-out";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StockOutTable } from "./stock-out-table";
import { StockOutSubmitDialog } from "./stock-out-submit-dialog";
import { StockOutApproveDialog } from "./stock-out-approve-dialog";
import { StockOutRejectDialog } from "./stock-out-reject-dialog";
import { useIsAdmin, useIsStaff } from "@/hooks/use-current-user";

export function StockOutList() {
  const [allStockOuts, setAllStockOuts] = useState<StockOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [submitTarget, setSubmitTarget] = useState<StockOut | null>(null);
  const [approveTarget, setApproveTarget] = useState<StockOut | null>(null);
  const [rejectTarget, setRejectTarget] = useState<StockOut | null>(null);

  const router = useRouter();
  const isAdmin = useIsAdmin();
  const isStaff = useIsStaff();

  const fetchStockOuts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // BE không trả kèm tên khách hàng trong StockOutOutput, nên fetch song
      // song danh sách customer rồi tự join tên vào — xem lib/enrich-stock-out.ts
      const [stockOuts, customers] = await Promise.all([
        stockOutService.list(),
        customerService.list(),
      ]);
      setAllStockOuts(withCustomerNames(stockOuts ?? [], customers ?? []));
    } catch (err) {
      console.error("Failed to load stock-outs", err);
      setError("Không thể tải danh sách phiếu xuất. Vui lòng thử lại sau.");
      setAllStockOuts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockOuts();
  }, [fetchStockOuts]);

  const stockOuts = useMemo(() => {
    let filtered = allStockOuts;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          (s.customerName ?? "").toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.status === (statusFilter as StockOutStatus),
      );
    }

    return filtered;
  }, [allStockOuts, search, statusFilter]);

  const handleView = useCallback(
    (stockOut: StockOut) => {
      router.push(`/stock-out/${stockOut.id}`);
    },
    [router],
  );

  function handleDialogSuccess(fresh: StockOut) {
    // Giữ lại customerName đã enrich trước đó — fresh trả về từ BE không có field này.
    setAllStockOuts((prev) =>
      prev.map((item) =>
        item.id === fresh.id
          ? { ...fresh, customerName: item.customerName }
          : item,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Phiếu xuất kho
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Quản lý phiếu xuất hàng cho khách hàng
          </p>
        </div>

        <Button
          type="button"
          hidden={!isStaff}
          size="sm"
          className="h-9 bg-slate-900 text-sm hover:bg-slate-800"
          onClick={() => router.push("/stock-out/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu xuất
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm theo mã phiếu, khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px] border-slate-200 text-sm">
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

        <p className="ml-auto text-xs text-slate-400">
          {stockOuts.length} phiếu xuất
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <StockOutTable
        stockOuts={stockOuts}
        isLoading={isLoading}
        onView={handleView}
        onSubmit={isStaff ? (stockOut) => setSubmitTarget(stockOut) : undefined}
        onApprove={
          isAdmin ? (stockOut) => setApproveTarget(stockOut) : undefined
        }
        onReject={isAdmin ? (stockOut) => setRejectTarget(stockOut) : undefined}
      />

      <StockOutSubmitDialog
        stockOut={submitTarget}
        open={!!submitTarget}
        onOpenChange={(open) => !open && setSubmitTarget(null)}
        onSuccess={handleDialogSuccess}
      />

      <StockOutApproveDialog
        stockOut={approveTarget}
        open={!!approveTarget}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        onSuccess={handleDialogSuccess}
      />

      <StockOutRejectDialog
        stockOut={rejectTarget}
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
