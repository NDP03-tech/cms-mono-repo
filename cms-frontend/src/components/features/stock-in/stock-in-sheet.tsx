// src/components/features/stock-in/stock-in-sheet.tsx

"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { StockIn } from "@/types/stock-in.types";

import { stockInService } from "@/services/stock-in.service";

interface StockInSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (stockIn: StockIn) => void;

  supplierId?: string;
  supplierName?: string;

  createdBy: string;
  currency?: string;
}

export function StockInSheet({
  open,
  onClose,
  onSuccess,
  supplierId,
  supplierName,
  createdBy,
  currency = "VND",
}: StockInSheetProps) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!supplierId) {
      setError("Vui lòng chọn nhà cung cấp.");

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const stockInId = await stockInService.create({
        supplierId,
        createdBy,
        currency,
      });

      // Load full object to keep callers compatible
      const stockIn = await stockInService.getById(stockInId);

      onSuccess(stockIn);
      onClose();
    } catch (error) {
      console.error("Create stock-in error:", error);

      setError("Không thể tạo phiếu nhập kho. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value && !loading) {
          onClose();
        }
      }}
    >
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tạo phiếu nhập kho</SheetTitle>

          <SheetDescription>
            Tạo phiếu nháp trước, sau đó thêm sản phẩm và gửi duyệt.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 py-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Nhà cung cấp</Label>

            <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
              <Building2 className="h-4 w-4 text-slate-400" />

              <span className="text-sm text-slate-700">
                {supplierName ?? "Chưa chọn nhà cung cấp"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tiền tệ</Label>

            <Input value={currency} disabled className="bg-slate-50" />
          </div>

          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-400">Quy trình</p>

            <p className="mt-1 text-sm text-slate-600">
              Tạo nháp → Thêm sản phẩm → Gửi duyệt → Quản trị viên duyệt
            </p>
          </div>
        </div>

        <SheetFooter className="gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
            disabled={loading || !supplierId}
            className="flex-1"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tạo phiếu
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
