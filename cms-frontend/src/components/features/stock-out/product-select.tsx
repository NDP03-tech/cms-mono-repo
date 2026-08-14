// src/components/features/stock-out/product-select.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Product } from "@/types/product.types";
import { productService } from "@/services/product.service";

interface ProductSelectProps {
  onSelect: (product: Product) => void;
  /** Loại các productId đã có trong phiếu nháp — tránh chọn trùng (khớp rule addItem() ở domain). */
  excludeIds?: string[];
}

const CURRENCIES = ["VND", "USD"];

export function ProductSelect({
  onSelect,
  excludeIds = [],
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Tạo nhanh sản phẩm ngay trong popover — gọi thẳng productService.create()
  // nên sản phẩm tạo ra là THẬT, lưu vào danh mục (khớp CreateProductInput ở BE).
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCurrency, setNewCurrency] = useState("VND");
  const [createError, setCreateError] = useState<string | null>(null);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await productService.list(
          search ? { name: search } : undefined,
        );
        if (active) setProducts(data ?? []);
      } catch (error) {
        console.error("Failed to load products:", error);
        if (active) {
          setLoadError("Không tải được danh sách sản phẩm.");
          setProducts([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [open, search]);

  const filtered = products.filter((p) => !excludeIds.includes(p.id));

  function openCreateForm() {
    setCreating(true);
    setNewName(search);
    setNewSku("");
    setNewUnit("");
    setNewPrice("");
    setNewCurrency("VND");
    setCreateError(null);
  }

  async function handleCreate() {
    if (!newName.trim()) {
      setCreateError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!newSku.trim()) {
      setCreateError("Vui lòng nhập SKU (bắt buộc, phải là duy nhất).");
      return;
    }
    const price = Number(newPrice);
    if (!(price > 0)) {
      setCreateError("Đơn giá phải lớn hơn 0.");
      return;
    }

    setSubmittingCreate(true);
    setCreateError(null);
    try {
      const id = await productService.create({
        sku: newSku.trim(),
        name: newName.trim(),
        costPrice: price,
        currency: newCurrency,
        unit: newUnit.trim() || undefined,
      });
      const created: Product = {
        id,
        sku: newSku.trim(),
        name: newName.trim(),
        unit: newUnit.trim(),
        costPrice: price,
        currency: newCurrency,
        isActive: true,
      };
      setProducts((prev) => [created, ...prev]);
      onSelect(created);
      setOpen(false);
      setCreating(false);
      setSearch("");
    } catch (err: any) {
      setCreateError(
        err?.response?.data?.message ??
          "Không thể tạo sản phẩm. SKU có thể đã tồn tại hoặc kết nối API lỗi.",
      );
    } finally {
      setSubmittingCreate(false);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setCreating(false);
          setCreateError(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start h-9 border-dashed border-slate-300 text-sm font-normal text-slate-500 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0" align="start">
        {creating ? (
          <div className="p-3 space-y-3 max-h-[440px] overflow-y-auto">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="h-7 w-7 p-0 rounded-md"
                onClick={() => setCreating(false)}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
              <p className="text-sm font-medium text-slate-900">
                Thêm sản phẩm mới
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tên sản phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Gạo ST25 5kg"
                className="h-9 border-slate-200 text-sm"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                placeholder="VD: GAO-ST25-5KG"
                className="h-9 border-slate-200 text-sm"
              />
              <p className="text-xs text-slate-400">
                SKU phải là duy nhất trong toàn hệ thống.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Đơn vị tính
              </Label>
              <Input
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="VD: bao, thùng, kg..."
                className="h-9 border-slate-200 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Đơn giá <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0"
                  className="h-9 border-slate-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Tiền tệ
                </Label>
                <Select value={newCurrency} onValueChange={setNewCurrency}>
                  <SelectTrigger className="h-9 text-sm border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {createError && (
              <p className="text-xs text-red-600">{createError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="h-8 border-slate-200 text-sm"
                onClick={() => setCreating(false)}
                disabled={submittingCreate}
              >
                Huỷ
              </Button>
              <Button
                type="button"
                className="h-8 bg-slate-900 hover:bg-slate-800 text-sm"
                onClick={handleCreate}
                disabled={submittingCreate}
              >
                {submittingCreate && (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                )}
                Tạo &amp; chọn
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center border-b border-slate-200 px-3">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <Input
                placeholder="Tìm theo tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 h-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
              />
            </div>

            <div className="max-h-[240px] overflow-y-auto">
              {loading ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Đang tải sản phẩm...
                </div>
              ) : loadError ? (
                <div className="py-6 text-center text-xs text-red-500 px-4">
                  {loadError}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Không tìm thấy sản phẩm
                </div>
              ) : (
                filtered.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      onSelect(product);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm text-slate-700">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {product.sku}
                        {product.unit && ` · ${product.unit}`}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 p-1.5">
              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-left text-sm text-slate-700"
              >
                <Plus className="h-4 w-4 text-slate-500" />
                Thêm sản phẩm mới{search ? `: "${search}"` : ""}
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
