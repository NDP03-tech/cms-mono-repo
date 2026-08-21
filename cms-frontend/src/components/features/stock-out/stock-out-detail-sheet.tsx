"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StockOutStatusBadge } from "./stock-out-status-badge";
import { StockOutDetailItemsEditor } from "./stock-out-detail-items-editor";
import { stockOutService } from "@/services/stock-out.service";
import type { StockOut } from "@/types/stock-out.types";
import { useIsAdmin, useIsStaff } from "@/hooks/use-current-user";

interface StockOutDetailSheetProps {
  stockOutId: string | null;
  onOpenChange: (open: boolean) => void;
  /** Approve/Reject chỉ dành cho ADMIN — khớp @Roles(Role.ADMIN) ở StockOutController. */
  canApprove?: boolean;
  customerName?: string;
  /** Cho phép trang cha (list / customer detail) refetch sau khi trạng thái hoặc item thay đổi. */
  onChanged?: () => void;
}

const formatDateTime = (d?: string) =>
  d
    ? new Date(d).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export function StockOutDetailSheet({
  stockOutId,
  onOpenChange,
  canApprove = false,
  customerName,
  onChanged,
}: StockOutDetailSheetProps) {
  const [stockOut, setStockOut] = useState<StockOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<
    "submit" | "approve" | "reject" | null
  >(null);
  const isAdmin = useIsAdmin();
  const isStaff = useIsStaff();

  const load = useCallback(async () => {
    if (!stockOutId) return;
    setLoading(true);
    try {
      const data = await stockOutService.getById(stockOutId);
      setStockOut(data);
    } finally {
      setLoading(false);
    }
  }, [stockOutId]);

  useEffect(() => {
    if (stockOutId) load();
    else setStockOut(null);
  }, [stockOutId, load]);

  const runAction = async (action: "submit" | "approve" | "reject") => {
    if (!stockOutId) return;
    setActionError(null);
    setActionLoading(action);
    try {
      if (action === "submit") await stockOutService.submit(stockOutId);
      if (action === "approve") await stockOutService.approve(stockOutId);
      if (action === "reject") await stockOutService.reject(stockOutId);
      await load();
      onChanged?.();
    } catch (err: any) {
      setActionError(err?.response?.data?.message ?? "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleItemsChanged = async () => {
    await load();
    onChanged?.();
  };

  return (
    <Sheet
      open={Boolean(stockOutId)}
      onOpenChange={(o) => !o && onOpenChange(false)}
    >
      <SheetContent className="sm:max-w-2xl bg-white overflow-y-auto">
        {loading && !stockOut ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : stockOut ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-semibold text-slate-900">
                  {stockOut.code}
                </SheetTitle>
                <StockOutStatusBadge status={stockOut.status} />
              </div>
            </SheetHeader>

            <div className="space-y-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Customer
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {customerName ?? stockOut.customerId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created by
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {stockOut.createdBy}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created at
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {formatDateTime(stockOut.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Approved at
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {formatDateTime(stockOut.approvedAt)}
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">Items</h3>
                <StockOutDetailItemsEditor
                  stockOutId={stockOut.id}
                  items={stockOut.items}
                  currency={stockOut.currency}
                  editable={stockOut.status === "draft" && isStaff}
                  onChanged={handleItemsChanged}
                />
              </div>

              {actionError && (
                <p className="text-xs text-red-600">{actionError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
              {stockOut.status === "draft" && stockOut.items.length === 0 && (
                <p className="text-xs text-slate-400 mr-auto">
                  Add at least one item before submitting
                </p>
              )}
              {stockOut.status === "draft" && isStaff && (
                <Button
                  className="h-9 bg-slate-900 text-white hover:bg-slate-800"
                  disabled={
                    stockOut.items.length === 0 || actionLoading !== null
                  }
                  onClick={() => runAction("submit")}
                >
                  {actionLoading === "submit" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit for approval
                </Button>
              )}
              {stockOut.status === "pending" && canApprove && isAdmin && (
                <>
                  <Button
                    variant="outline"
                    className="h-9 border-red-200 text-red-600 hover:bg-red-50"
                    disabled={actionLoading !== null}
                    onClick={() => runAction("reject")}
                  >
                    {actionLoading === "reject" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  <Button
                    className="h-9 bg-slate-900 text-white hover:bg-slate-800"
                    disabled={actionLoading !== null}
                    onClick={() => runAction("approve")}
                  >
                    {actionLoading === "approve" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
