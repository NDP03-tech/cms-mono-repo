// src/app/(dashboard)/stock-out/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  SendHorizonal,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StockOutStatusBadge } from "@/components/features/stock-out/stock-out-status-badge";
import {
  StockOutItemsEditor,
  StockOutItemDraft,
} from "@/components/features/stock-out/stock-out-items-editor";
import { StockOut } from "@/types/stock-out.types";
import { stockOutService } from "@/services/stock-out.service";

export default function StockOutDetailPage() {
  const params = useParams();
  const [stockOut, setStockOut] = useState<StockOut | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "submit" | "approve" | "reject" | null
  >(null);
  const [draftItems, setDraftItems] = useState<StockOutItemDraft[]>([]);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;
      setIsLoading(true);
      try {
        const data = await stockOutService.getById(params.id);
        setStockOut(data);
      } catch {
        setStockOut(null);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [params]);

  useEffect(() => {
    if (!stockOut) {
      setDraftItems([]);
      return;
    }

    setDraftItems(
      stockOut.items.map((i) => ({
        tempId: i.id,
        productId: i.productId,
        productName: i.productName,
        productSku: i.productSku,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        currency: i.currency,
      })),
    );
  }, [stockOut]);

  if (!stockOut) {
    return (
      <div className="text-slate-500">
        Đang tải hoặc không tìm thấy phiếu xuất.
      </div>
    );
  }

  const isDraft = stockOut.status === "draft";
  const isPending = stockOut.status === "pending";

  async function handleAction(action: "submit" | "approve" | "reject") {
    setIsLoading(true);
    try {
      // Khi kết nối BE thật:
      // if (action === 'submit') await stockOutService.submit(stockOut.id);
      // if (action === 'approve') await stockOutService.approve(stockOut.id);
      // if (action === 'reject') await stockOutService.reject(stockOut.id);

      await new Promise((resolve) => setTimeout(resolve, 600));
      const nextStatus =
        action === "submit"
          ? "pending"
          : action === "approve"
            ? "approved"
            : "rejected";
      setStockOut((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      setConfirmAction(null);
    } finally {
      setIsLoading(false);
    }
  }

  const actionConfig = {
    submit: {
      title: "Gửi phiếu duyệt",
      description:
        "Bạn có chắc muốn gửi phiếu này lên để duyệt? Sau khi gửi sẽ không thể chỉnh sửa.",
      confirmLabel: "Gửi duyệt",
      confirmClass: "bg-slate-900 hover:bg-slate-800 text-white",
    },
    approve: {
      title: "Duyệt phiếu xuất",
      description:
        "Xác nhận duyệt phiếu xuất này? Tồn kho sẽ được trừ sau khi duyệt.",
      confirmLabel: "Duyệt",
      confirmClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    reject: {
      title: "Từ chối phiếu xuất",
      description: "Bạn có chắc muốn từ chối phiếu xuất này?",
      confirmLabel: "Từ chối",
      confirmClass: "bg-red-600 hover:bg-red-700 text-white",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/stock-out"
            className="h-8 w-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-slate-900 font-mono">
                {stockOut.code}
              </h1>
              <StockOutStatusBadge status={stockOut.status} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Tạo lúc {new Date(stockOut.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isDraft && (
            <Button
              onClick={() => setConfirmAction("submit")}
              size="sm"
              className="h-9 bg-slate-900 hover:bg-slate-800"
              disabled={isLoading}
            >
              <SendHorizonal className="h-4 w-4 mr-2" />
              Gửi duyệt
            </Button>
          )}
          {isPending && (
            <>
              <Button
                onClick={() => setConfirmAction("reject")}
                size="sm"
                variant="outline"
                className="h-9 border-red-200 text-red-600 hover:bg-red-50"
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button
                onClick={() => setConfirmAction("approve")}
                size="sm"
                className="h-9 bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Duyệt
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-sm font-medium text-slate-900 mb-4">
          Thông tin phiếu xuất
        </h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Khách hàng
            </p>
            <p className="text-sm text-slate-700 mt-1 font-medium">
              {stockOut.customerName}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Người tạo
            </p>
            <p className="text-sm text-slate-700 mt-1">{stockOut.createdBy}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Đơn vị tiền tệ
            </p>
            <p className="text-sm text-slate-700 mt-1">{stockOut.currency}</p>
          </div>
          {stockOut.approvedAt && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Ngày duyệt
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {new Date(stockOut.approvedAt).toLocaleString("vi-VN")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-slate-900">
          Danh sách sản phẩm
          <span className="ml-2 text-xs text-slate-400 font-normal">
            ({draftItems.length} sản phẩm)
          </span>
        </h2>
        <Separator />
        <StockOutItemsEditor
          items={draftItems}
          onChange={setDraftItems}
          currency={stockOut.currency}
          readOnly={!isDraft}
        />
      </div>

      {/* Confirm dialog */}
      {confirmAction && (
        <AlertDialog open onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-semibold text-slate-900">
                {actionConfig[confirmAction].title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-500">
                {actionConfig[confirmAction].description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="h-9 border-slate-200 text-slate-700"
                disabled={isLoading}
              >
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleAction(confirmAction)}
                className={`h-9 ${actionConfig[confirmAction].confirmClass}`}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {actionConfig[confirmAction].confirmLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
