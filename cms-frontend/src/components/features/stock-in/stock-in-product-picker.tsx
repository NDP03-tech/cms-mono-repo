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

export function StockInProductPicker({ excludeIds, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);

      try {
        const data = await productService.list({
          search: search.trim(),
        });

        setProducts(data.filter((product) => !excludeIds.includes(product.id)));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, excludeIds]);

  return (
    <div className="relative">
      <div className="relative">
        <PackageSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm sản phẩm theo tên hoặc SKU..."
          className="h-10 pl-9"
        />

        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {products.length > 0 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                onSelect(product);
                setSearch("");
                setProducts([]);
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
                {product.costPrice.toLocaleString("vi-VN")} {product.currency}
              </span>
            </button>
          ))}
        </div>
      )}

      {search && !loading && products.length === 0 && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-200 bg-white p-4 text-center text-xs text-slate-400 shadow-lg">
          Không tìm thấy sản phẩm
        </div>
      )}
    </div>
  );
}
