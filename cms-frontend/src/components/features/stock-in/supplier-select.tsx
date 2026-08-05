// src/components/features/stock-in/supplier-select.tsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Supplier } from "@/types/supplier.types";

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "Công ty TNHH Dệt may Hà Nội",
    phone: "0901234567",
    email: "contact@detmayhanoi.vn",
    address: "123 Nguyễn Trãi, Hà Nội",
    isActive: true,
  },
  {
    id: "2",
    name: "Xưởng may Sài Gòn",
    phone: "0987654321",
    email: "info@xuongmaysaigon.vn",
    address: "456 Lê Văn Sỹ, TP.HCM",
    isActive: true,
  },
  {
    id: "4",
    name: "Công ty Thời trang XYZ",
    phone: "0923456789",
    email: "xyz@fashion.vn",
    address: "321 Hoàng Diệu, Hải Phòng",
    isActive: true,
  },
];

interface SupplierSelectProps {
  value?: string;
  onSelect: (supplier: Supplier) => void;
}

export function SupplierSelect({ value, onSelect }: SupplierSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MOCK_SUPPLIERS.filter((s) => {
    if (!search) return true;
    return s.name.toLowerCase().includes(search.toLowerCase());
  });

  const selected = MOCK_SUPPLIERS.find((s) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-9 border-slate-200 text-sm font-normal text-slate-700 hover:bg-slate-50"
        >
          {selected ? (
            <span className="truncate">{selected.name}</span>
          ) : (
            <span className="text-slate-400">Chọn nhà cung cấp...</span>
          )}
          <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <div className="flex items-center border-b border-slate-200 px-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Tìm nhà cung cấp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 h-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Không tìm thấy nhà cung cấp
            </div>
          ) : (
            filtered.map((supplier) => (
              <button
                key={supplier.id}
                onClick={() => {
                  onSelect(supplier);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm text-slate-700">{supplier.name}</p>
                  {supplier.phone && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {supplier.phone}
                    </p>
                  )}
                </div>
                {value === supplier.id && (
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
