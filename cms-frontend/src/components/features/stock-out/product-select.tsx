// src/components/features/stock-out/product-select.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import { Product } from "@/types/product.types";
import { productService } from "@/services/product.service";

interface ProductSelectProps {
  onSelect: (product: Product) => void;
  /** Loại các productId đã có trong phiếu nháp — tránh chọn trùng (khớp rule addItem() ở domain). */
  excludeIds?: string[];
}

export function ProductSelect({
  onSelect,
  excludeIds = [],
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await productService.list(search || undefined);
        if (active) setProducts(data ?? []);
      } catch (error) {
        console.error("Failed to load products:", error);
        if (active) setProducts([]);
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        <div className="flex items-center border-b border-slate-200 px-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Tìm theo tên, SKU..."
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
                  <p className="text-xs text-slate-400 mt-0.5">{product.sku}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
