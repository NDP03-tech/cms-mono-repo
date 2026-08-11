// src/components/features/stock-in/stock-in-form.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockInItemsEditor } from "./stock-in-items-editor";

import { StockInItemDraft, CreateStockInInput } from "@/types/stock-in.types";

import { Product } from "@/types/product.types";
import { Supplier } from "@/types/supplier.types";

import { stockInService } from "@/services/stock-in.service";
import { supplierService } from "@/services/supplier.service";

interface StockInFormProps {
  createdBy: string;
  currency?: string;
}

export function StockInForm({ createdBy, currency = "VND" }: StockInFormProps) {
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState("");

  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);

  const [items, setItems] = useState<StockInItemDraft[]>([]);

  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /**
   * Load suppliers
   */
  useEffect(() => {
    async function loadSuppliers() {
      setLoadingSuppliers(true);

      try {
        const data = await supplierService.list();

        setSuppliers(data ?? []);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
        setSuppliers([]);
        setError("Không thể tải danh sách nhà cung cấp.");
      } finally {
        setLoadingSuppliers(false);
      }
    }

    loadSuppliers();
  }, []);

  /**
   * Selected supplier
   */
  const selectedSupplier = useMemo(() => {
    return suppliers.find((supplier) => supplier.id === supplierId);
  }, [suppliers, supplierId]);

  /**
   * Filter suppliers
   */
  const filteredSuppliers = useMemo(() => {
    const keyword = supplierSearch.trim().toLowerCase();

    if (!keyword) {
      return suppliers;
    }

    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.code?.toLowerCase().includes(keyword) ||
        supplier.phone?.toLowerCase().includes(keyword)
      );
    });
  }, [suppliers, supplierSearch]);

  /**
   * Add product
   */
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

  /**
   * Update item
   */
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

  /**
   * Remove item
   */
  function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((item) => item.tempId !== itemId));
  }

  /**
   * Submit
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);

    /**
     * Validate supplier
     */
    if (!supplierId) {
      setError("Vui lòng chọn nhà cung cấp.");
      return;
    }

    /**
     * Validate products
     */
    if (items.length === 0) {
      setError("Vui lòng thêm ít nhất một sản phẩm.");
      return;
    }

    setLoading(true);

    try {
      const input: CreateStockInInput = {
        supplierId,
        createdBy,
        currency,

        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
        })),
      };

      const stockIn = await stockInService.create(input);

      router.push(`/stock-in/${stockIn.id}`);
    } catch (error) {
      console.error("Create stock-in failed:", error);

      setError("Không thể tạo phiếu nhập. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* =========================
          Supplier
      ========================= */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Thông tin phiếu nhập
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Chọn nhà cung cấp cho phiếu nhập này.
          </p>
        </div>

        <div className="max-w-xl">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nhà cung cấp
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <button
              type="button"
              disabled={loadingSuppliers || loading}
              onClick={() => setSupplierDropdownOpen((prev) => !prev)}
              className="
                flex
                h-10
                w-full
                items-center
                justify-between
                rounded-md
                border
                border-slate-200
                bg-white
                px-3
                text-left
                text-sm
                transition-colors
                hover:border-slate-300
                focus:outline-none
                focus:ring-2
                focus:ring-slate-900
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            >
              <span
                className={
                  selectedSupplier ? "text-slate-900" : "text-slate-400"
                }
              >
                {loadingSuppliers
                  ? "Đang tải nhà cung cấp..."
                  : selectedSupplier
                    ? selectedSupplier.name
                    : "Chọn nhà cung cấp"}
              </span>

              {loadingSuppliers ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {supplierDropdownOpen && !loadingSuppliers && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  z-50
                  mt-1
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  shadow-lg
                "
              >
                {/* Search */}
                <div className="border-b border-slate-100 p-2">
                  <div className="relative">
                    <Search
                      className="
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <Input
                      value={supplierSearch}
                      onChange={(e) => setSupplierSearch(e.target.value)}
                      placeholder="Tìm nhà cung cấp..."
                      className="h-9 pl-9 text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Supplier list */}
                <div className="max-h-64 overflow-y-auto p-1">
                  {filteredSuppliers.length === 0 ? (
                    <div className="px-3 py-8 text-center">
                      <p className="text-sm text-slate-500">
                        Không tìm thấy nhà cung cấp
                      </p>
                    </div>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <button
                        key={supplier.id}
                        type="button"
                        onClick={() => {
                          setSupplierId(supplier.id);
                          setSupplierDropdownOpen(false);
                          setSupplierSearch("");
                        }}
                        className="
                          flex
                          w-full
                          flex-col
                          rounded-md
                          px-3
                          py-2.5
                          text-left
                          hover:bg-slate-50
                        "
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {supplier.name}
                        </span>

                        <span className="mt-0.5 text-xs text-slate-400">
                          {supplier.code && <span>{supplier.code}</span>}

                          {supplier.phone && (
                            <span className="ml-2">{supplier.phone}</span>
                          )}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedSupplier && (
            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Nhà cung cấp đã chọn</p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {selectedSupplier.name}
                  </p>
                </div>

                {selectedSupplier.phone && (
                  <p className="text-xs text-slate-500">
                    {selectedSupplier.phone}
                  </p>
                )}
              </div>
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
            Sản phẩm nhập kho
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Thêm các sản phẩm và nhập số lượng, đơn giá.
          </p>
        </div>

        <StockInItemsEditor
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
          disabled={
            loading || loadingSuppliers || !supplierId || items.length === 0
          }
          className="min-w-[150px] bg-slate-900 hover:bg-slate-800"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {loading ? "Đang tạo..." : "Tạo phiếu nhập"}
        </Button>
      </div>
    </form>
  );
}
