// src/components/features/stock-out/stock-out-form.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StockOutItemsEditor } from "./stock-out-items-editor";
import { CustomerSelect } from "./customer-select";

import {
  StockOutItemDraft,
  CreateStockOutInput,
} from "@/types/stock-out.types";

import { Product } from "@/types/product.types";
import { Customer } from "@/types/customer.types";

import { stockOutService } from "@/services/stock-out.service";
import { customerService } from "@/services/customer.service";

interface StockOutFormProps {
  currency?: string;
  /** Prefill khách hàng khi tạo phiếu từ trang chi tiết khách hàng (?customerId=...). */
  initialCustomerId?: string;
}

export function StockOutForm({
  currency = "VND",
  initialCustomerId,
}: StockOutFormProps) {
  const router = useRouter();

  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState<string | undefined>();

  const [items, setItems] = useState<StockOutItemDraft[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill khách hàng khi được điều hướng tới kèm ?customerId= (từ customer-detail).
  useEffect(() => {
    if (!initialCustomerId) return;
    let active = true;
    customerService
      .getById(initialCustomerId)
      .then((customer) => {
        if (active) {
          setCustomerId(customer.id);
          setCustomerName(customer.name);
        }
      })
      .catch((err) => {
        console.error("Failed to preload customer:", err);
      });
    return () => {
      active = false;
    };
  }, [initialCustomerId]);

  function handleSelectCustomer(customer: Customer) {
    setCustomerId(customer.id);
    setCustomerName(customer.name);
  }

  function handleAdd(product: Product) {
    if (items.some((item) => item.productId === product.id)) {
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: 1,
        unitPrice: product.costPrice,
        currency: product.currency,
      },
    ]);
  }

  function handleChange(
    itemId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.tempId === itemId
          ? {
              ...item,
              [field]:
                field === "quantity" ? Math.max(1, value) : Math.max(0, value),
            }
          : item,
      ),
    );
  }

  function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((item) => item.tempId !== itemId));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!customerId) {
      setError("Vui lòng chọn khách hàng.");
      return;
    }

    if (items.length === 0) {
      setError("Vui lòng thêm ít nhất một sản phẩm.");
      return;
    }

    setLoading(true);

    try {
      const input: CreateStockOutInput = {
        customerId,
        currency,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
        })),
      };

      const stockOutId = await stockOutService.create(input);
      router.push(`/stock-out/${stockOutId}`);
    } catch {
      setError("Không thể tạo phiếu xuất. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* =========================
          Customer
      ========================= */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Thông tin phiếu xuất
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Chọn khách hàng cho phiếu xuất này.
          </p>
        </div>

        <div className="max-w-xl space-y-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Khách hàng
            <span className="ml-1 text-red-500">*</span>
          </label>

          <CustomerSelect value={customerId} onSelect={handleSelectCustomer} />

          {customerName && (
            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <p className="text-xs text-slate-400">Khách hàng đã chọn</p>
              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {customerName}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          Products
      ========================= */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Sản phẩm xuất kho
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Thêm các sản phẩm và nhập số lượng, đơn giá.
          </p>
        </div>

        <StockOutItemsEditor
          items={items}
          currency={currency}
          onAdd={handleAdd}
          onChange={handleChange}
          onRemove={handleRemove}
        />
      </section>

      {/* =========================
          Actions
      ========================= */}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Hủy
        </Button>

        <Button
          type="submit"
          disabled={loading || !customerId || items.length === 0}
          className="min-w-[150px] bg-slate-900 hover:bg-slate-800"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Đang tạo..." : "Tạo phiếu xuất"}
        </Button>
      </div>
    </form>
  );
}
