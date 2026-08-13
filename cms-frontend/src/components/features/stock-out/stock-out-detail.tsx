// src/components/features/stock-out/stock-out-detail.tsx
//
// Đây là component MỚI, thay thế stock-out-detail-sheet.tsx (bị lệch tên
// export `StockOutDetail` vs `StockOutDetailSheet`, và lệch props
// `initialStockOut` vs `stockOutId`+`onOpenChange` mà [id]/page.tsx cần).
// Kiến trúc page-based nên đây là trang đầy đủ, không bọc trong Sheet.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockOutStatusBadge } from "./stock-out-status-badge";
import { StockOutInfo } from "./stock-out-info";
import { StockOutDetailItemsEditor } from "./stock-out-detail-items-editor";
import { StockOutSubmitDialog } from "./stock-out-submit-dialog";
import { StockOutApproveDialog } from "./stock-out-approve-dialog";
import { StockOutRejectDialog } from "./stock-out-reject-dialog";
import { stockOutService } from "@/services/stock-out.service";
import type { StockOut } from "@/types/stock-out.types";

interface StockOutDetailProps {
  initialStockOut: StockOut;
  /** Approve/Reject chỉ dành cho ADMIN — khớp @Roles(Role.ADMIN) ở StockOutController. */
  canApprove?: boolean;
}

export function StockOutDetail({
  initialStockOut,
  canApprove = false,
}: StockOutDetailProps) {
  const router = useRouter();
  const [stockOut, setStockOut] = useState<StockOut>(initialStockOut);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  // Dialog trả về StockOut thô từ BE (không có customerName) — giữ lại phần
  // đã enrich trước đó để không bị mất tên khách hàng trên UI.
  const handleStatusChanged = (fresh: StockOut) => {
    setStockOut((prev) => ({
      ...fresh,
      customerName: prev.customerName,
      createdByName: prev.createdByName,
    }));
  };

  const handleItemsChanged = async () => {
    const fresh = await stockOutService.getById(stockOut.id);
    handleStatusChanged(fresh);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/stock-out")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-900">
            {stockOut.code}
          </h1>
          <StockOutStatusBadge status={stockOut.status} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {stockOut.status === "draft" && (
            <Button
              size="sm"
              className="h-9 bg-slate-900 hover:bg-slate-800"
              disabled={stockOut.items.length === 0}
              onClick={() => setSubmitOpen(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Gửi duyệt
            </Button>
          )}
          {stockOut.status === "pending" && canApprove && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-9 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button
                size="sm"
                className="h-9 bg-slate-900 hover:bg-slate-800"
                onClick={() => setApproveOpen(true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Duyệt
              </Button>
            </>
          )}
        </div>
      </div>

      {stockOut.status === "draft" && stockOut.items.length === 0 && (
        <p className="text-xs text-slate-400">
          Thêm ít nhất một sản phẩm trước khi gửi duyệt
        </p>
      )}

      <StockOutInfo stockOut={stockOut} />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-900">Sản phẩm</h3>
        <StockOutDetailItemsEditor
          stockOutId={stockOut.id}
          items={stockOut.items}
          currency={stockOut.currency}
          editable={stockOut.status === "draft"}
          onChanged={handleItemsChanged}
        />
      </div>

      <StockOutSubmitDialog
        stockOut={stockOut}
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        onSuccess={handleStatusChanged}
      />
      <StockOutApproveDialog
        stockOut={stockOut}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={handleStatusChanged}
      />
      <StockOutRejectDialog
        stockOut={stockOut}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={handleStatusChanged}
      />
    </div>
  );
}
