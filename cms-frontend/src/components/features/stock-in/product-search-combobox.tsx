// src/components/features/stock-in/product-search-combobox.tsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product.types";

// Mock products — thay bằng API call khi BE sẵn sàng
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    sku: "SP-001",
    name: "Áo thun nam cổ tròn",
    unit: "cái",
    costPrice: 150000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "2",
    sku: "SP-002",
    name: "Quần jean nam slim fit",
    unit: "cái",
    costPrice: 350000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "3",
    sku: "SP-003",
    name: "Giày thể thao Nike",
    unit: "đôi",
    costPrice: 850000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "4",
    sku: "SP-005",
    name: "Túi xách da thật",
    unit: "cái",
    costPrice: 1200000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "5",
    sku: "SP-006",
    name: "Mũ lưỡi trai",
    unit: "cái",
    costPrice: 95000,
    currency: "VND",
    isActive: true,
  },
];

interface ProductSearchComboboxProps {
  value?: string;
  onSelect: (product: Product) => void;
  excludeIds?: string[];
}

export function ProductSearchCombobox({
  value,
  onSelect,
  excludeIds = [],
}: ProductSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) => {
    if (excludeIds.includes(p.id)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const selected = MOCK_PRODUCTS.find((p) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-9 border-slate-200 text-sm font-normal text-slate-700 hover:bg-slate-50"
        >
          {selected ? (
            <span className="truncate">
              <span className="font-mono text-xs text-slate-500 mr-1">
                {selected.sku}
              </span>
              {selected.name}
            </span>
          ) : (
            <span className="text-slate-400">Chọn sản phẩm...</span>
          )}
          <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <div className="flex items-center border-b border-slate-200 px-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Tìm theo tên hoặc SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 h-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
        </div>
        <div className="max-h-[240px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Không tìm thấy sản phẩm
            </div>
          ) : (
            filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onSelect(product);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 shrink-0">
                      {product.sku}
                    </span>
                    <span className="text-sm text-slate-700 truncate">
                      {product.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {product.costPrice.toLocaleString("vi-VN")}{" "}
                    {product.currency}
                    {product.unit && ` / ${product.unit}`}
                  </p>
                </div>
                {value === product.id && (
                  <Check className="h-4 w-4 text-slate-900 shrink-0 ml-2" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
