// src/components/features/stock-in/stock-in-product-picker.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, PackageSearch } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Product } from "@/types/product.types";
import { productService } from "@/services/product.service";

interface Props {
  excludeIds: string[];
  onSelect: (product: Product) => void;
}

// stock-in-product-picker.tsx — show danh sách mặc định khi focus
export function StockInProductPicker({ excludeIds, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Load khi focus dù search rỗng
      if (!focused) return;

      setLoading(true);
      try {
        const data = await productService.list(
          search.trim() ? { name: search.trim() } : {},
        );
        setProducts(data.filter((p) => !excludeIds.includes(p.id)));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, excludeIds, focused]);

  return (
    <div className="relative">
      <div className="relative">
        <PackageSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Tìm sản phẩm theo tên hoặc SKU..."
          className="h-10 pl-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {focused && products.length > 0 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onMouseDown={() => {
                // dùng onMouseDown thay vì onClick để tránh blur
                onSelect(product);
                setSearch("");
                setProducts([]);
                setFocused(false);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {product.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  {product.sku}
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {Number(product.costPrice).toLocaleString("vi-VN")}{" "}
                {product.currency}
              </span>
            </button>
          ))}
        </div>
      )}

      {focused && !loading && search && products.length === 0 && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-200 bg-white p-4 text-center text-xs text-slate-400 shadow-lg">
          Không tìm thấy sản phẩm
        </div>
      )}
    </div>
  );
}
