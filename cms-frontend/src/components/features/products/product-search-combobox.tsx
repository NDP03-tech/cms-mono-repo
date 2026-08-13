"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Product } from "@/types/product.types";
import { productService } from "@/services/product.service";

interface ProductSearchComboboxProps {
  onSelect: (product: Product) => void;
  excludeIds?: string[];
  disabled?: boolean;
}

export function ProductSearchCombobox({
  onSelect,
  excludeIds = [],
  disabled = false,
}: ProductSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);

      try {
        const data = await productService.list({
          search: search.trim() || undefined,
        });

        if (!cancelled) {
          setProducts(data ?? []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [open, search]);

  const availableProducts = useMemo(() => {
    const excluded = new Set(excludeIds);

    return products.filter(
      (product) => !excluded.has(product.id) && product.isActive !== false,
    );
  }, [products, excludeIds]);

  function handleSelect(product: Product) {
    onSelect(product);

    setSearch("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full justify-between border-slate-200 bg-white font-normal"
      >
        <span className="flex items-center gap-2 text-slate-500">
          <Search className="h-4 w-4" />
          Thêm sản phẩm
        </span>

        <ChevronsUpDown className="h-4 w-4 text-slate-400" />
      </Button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm hoặc SKU..."
              className="h-9"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-1">
            {loading ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400">
                Đang tải sản phẩm...
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400">
                Không tìm thấy sản phẩm
              </div>
            ) : (
              availableProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {product.name}
                    </p>

                    <p className="mt-0.5 text-xs font-mono text-slate-400">
                      {product.sku}
                    </p>
                  </div>

                  <Check className="ml-3 h-4 w-4 text-transparent" />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
