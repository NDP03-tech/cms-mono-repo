// src/app/(dashboard)/stock-in/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  SendHorizonal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { StockInStatusBadge } from "@/components/features/stock-in/stock-in-status-badge";
import {
  StockInItemsEditor,
  StockInItemDraft,
} from "@/components/features/stock-in/stock-in-items-editor";
import { StockIn } from "@/types/stock-in.types";

// Mock data — thay bằng API call
const MOCK_DETAIL: StockIn = {
  id: "3",
  code: "PN-20240117-001",
  supplierId: "1",
  supplierName: "Công ty TNHH Dệt may Hà Nội",
  createdBy: "admin",
  status: "draft",
  totalAmount: 4750000,
  currency: "VND",
  items: [
    {
      id: "i3",
      productId: "3",
      productName: "Giày thể thao Nike",
      productSku: "SP-003",
      quantity: 5,
      unitPrice: 850000,
      currency: "VND",
      totalPrice: 4250000,
    },
    {
      id: "i4",
      productId: "5",
      productName: "Mũ lưỡi trai",
      productSku: "SP-006",
      quantity: 5,
      unitPrice: 95000,
      currency: "VND",
      totalPrice: 475000,
    },
  ],
  createdAt: "2024-01-17T07:00:00Z",
};

export default function StockInDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [stockIn, setStockIn] = useState<StockIn>(MOCK_DETAIL);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "submit" | "approve" | "reject" | null
  >(null);

  const isDraft = stockIn.status === "draft";
  const isPending = stockIn.status === "pending";

  // Convert items to draft format for editor
  const [draftItems, setDraftItems] = useState<StockInItemDraft[]>(
    stockIn.items.map((i) => ({
      tempId: i.id,
      productId: i.productId,
      productName: i.productName,
      productSku: i.productSku,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      currency: i.currency,
    })),
  );

  async function handleAction(action: "submit" | "approve" | "reject") {
    setIsLoading(true);
    try {
      // Khi kết nối BE thật:
      // if (action === 'submit') await stockInService.submit(stockIn.id);
      // if (action === 'approve') await stockInService.approve(stockIn.id);
      // if (action === 'reject') await stockInService.reject(stockIn.id);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextStatus =
        action === "submit"
          ? "pending"
          : action === "approve"
            ? "approved"
            : "rejected";
      setStockIn((prev) => ({ ...prev, status: nextStatus }));
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
      title: "Duyệt phiếu nhập",
      description:
        "Xác nhận duyệt phiếu nhập này? Tồn kho sẽ được cập nhật sau khi duyệt.",
      confirmLabel: "Duyệt",
      confirmClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    reject: {
      title: "Từ chối phiếu nhập",
      description: "Bạn có chắc muốn từ chối phiếu nhập này?",
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
            href="/stock-in"
            className="h-8 w-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-slate-900 font-mono">
                {stockIn.code}
              </h1>
              <StockInStatusBadge status={stockIn.status} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Tạo lúc {new Date(stockIn.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Action buttons */}
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

      {/* Info section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-sm font-medium text-slate-900 mb-4">
          Thông tin phiếu nhập
        </h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Nhà cung cấp
            </p>
            <p className="text-sm text-slate-700 mt-1 font-medium">
              {stockIn.supplierName}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Người tạo
            </p>
            <p className="text-sm text-slate-700 mt-1">{stockIn.createdBy}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Đơn vị tiền tệ
            </p>
            <p className="text-sm text-slate-700 mt-1">{stockIn.currency}</p>
          </div>
          {stockIn.approvedAt && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Ngày duyệt
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {new Date(stockIn.approvedAt).toLocaleString("vi-VN")}
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
        <StockInItemsEditor
          items={draftItems}
          onChange={setDraftItems}
          currency={stockIn.currency}
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
