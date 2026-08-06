// src/app/(dashboard)/stock-out/new/page.tsx
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
import { CustomerSelect } from "@/components/features/stock-out/customer-select";
import {
  StockOutItemsEditor,
  StockOutItemDraft,
} from "@/components/features/stock-out/stock-out-items-editor";
import { Customer } from "@/types/customer.types";

export default function NewStockOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [currency, setCurrency] = useState("VND");
  const [items, setItems] = useState<StockOutItemDraft[]>([]);

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  async function handleSubmit(asDraft: boolean) {
    if (!selectedCustomer) {
      setError("Vui lòng chọn khách hàng");
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
      // const id = await stockOutService.create({
      //   customerId: selectedCustomer.id,
      //   createdBy: 'admin',
      //   currency,
      //   items: items.map(i => ({
      //     productId: i.productId,
      //     quantity: i.quantity,
      //     unitPrice: i.unitPrice,
      //     currency: i.currency,
      //   })),
      // });
      // if (!asDraft) await stockOutService.submit(id);
      // router.push(`/stock-out/${id}`);

      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/stock-out");
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/stock-out"
          className="h-8 w-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Tạo phiếu xuất kho
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
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Khách hàng <span className="text-red-500">*</span>
            </Label>
            <CustomerSelect
              value={selectedCustomer?.id}
              onSelect={setSelectedCustomer}
            />
          </div>

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

        {selectedCustomer && (
          <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 flex gap-6">
            {selectedCustomer.phone && (
              <div>
                <p className="text-xs text-slate-400">Số điện thoại</p>
                <p className="text-sm text-slate-700 mt-0.5">
                  {selectedCustomer.phone}
                </p>
              </div>
            )}
            {selectedCustomer.email && (
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm text-slate-700 mt-0.5">
                  {selectedCustomer.email}
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
        <StockOutItemsEditor
          items={items}
          onChange={setItems}
          currency={currency}
        />
      </div>

      {/* Footer */}
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
            onClick={() => router.push("/stock-out")}
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
