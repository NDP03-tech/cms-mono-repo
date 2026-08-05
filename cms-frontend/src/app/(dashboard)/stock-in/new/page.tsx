// src/app/(dashboard)/stock-in/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupplierSelect } from "@/components/features/stock-in/supplier-select";
import {
  StockInItemsEditor,
  StockInItemDraft,
} from "@/components/features/stock-in/stock-in-items-editor";
import { Supplier } from "@/types/supplier.types";

export default function NewStockInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [currency, setCurrency] = useState("VND");
  const [items, setItems] = useState<StockInItemDraft[]>([]);

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  async function handleSubmit(asDraft: boolean) {
    if (!selectedSupplier) {
      setError("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (items.length === 0) {
      setError("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Khi kết nối BE thật:
      // const id = await stockInService.create({
      //   supplierId: selectedSupplier.id,
      //   createdBy: 'admin',
      //   currency,
      //   items: items.map(i => ({
      //     productId: i.productId,
      //     quantity: i.quantity,
      //     unitPrice: i.unitPrice,
      //     currency: i.currency,
      //   })),
      // });
      // if (!asDraft) await stockInService.submit(id);
      // router.push(`/stock-in/${id}`);

      // Mock
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/stock-in");
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/stock-in"
          className="h-8 w-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Tạo phiếu nhập kho
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Điền thông tin và thêm sản phẩm vào phiếu
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-slate-900">Thông tin cơ bản</h2>
        <Separator />

        <div className="grid grid-cols-2 gap-4">
          {/* Supplier */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Nhà cung cấp <span className="text-red-500">*</span>
            </Label>
            <SupplierSelect
              value={selectedSupplier?.id}
              onSelect={setSelectedSupplier}
            />
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Đơn vị tiền tệ
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-9 border-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VND">VND</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Supplier info preview */}
        {selectedSupplier && (
          <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 flex gap-6">
            {selectedSupplier.phone && (
              <div>
                <p className="text-xs text-slate-400">Số điện thoại</p>
                <p className="text-sm text-slate-700 mt-0.5">
                  {selectedSupplier.phone}
                </p>
              </div>
            )}
            {selectedSupplier.email && (
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm text-slate-700 mt-0.5">
                  {selectedSupplier.email}
                </p>
              </div>
            )}
            {selectedSupplier.address && (
              <div>
                <p className="text-xs text-slate-400">Địa chỉ</p>
                <p className="text-sm text-slate-700 mt-0.5">
                  {selectedSupplier.address}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-medium text-slate-900">
          Danh sách sản phẩm
          {items.length > 0 && (
            <span className="ml-2 text-xs text-slate-400 font-normal">
              ({items.length} sản phẩm)
            </span>
          )}
        </h2>
        <Separator />
        <StockInItemsEditor
          items={items}
          onChange={setItems}
          currency={currency}
        />
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-6 py-4">
        <div>
          {items.length > 0 && (
            <div>
              <p className="text-xs text-slate-500">Tổng tiền</p>
              <p className="text-lg font-semibold text-slate-900">
                {total.toLocaleString("vi-VN")} {currency}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/stock-in")}
            className="h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            className="h-9 border-slate-200 text-slate-700"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            className="h-9 bg-slate-900 hover:bg-slate-800"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Tạo & Gửi duyệt
          </Button>
        </div>
      </div>
    </div>
  );
}
