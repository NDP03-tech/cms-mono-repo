// src/components/features/stock-out/customer-select.tsx
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
import { Customer } from "@/types/customer.types";

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    phone: "0912345678",
    email: "nguyenvanan@gmail.com",
    isActive: true,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    phone: "0923456789",
    email: "tranthibinh@gmail.com",
    isActive: true,
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    phone: "0945678901",
    email: "phamthidung@gmail.com",
    isActive: true,
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    phone: "0956789012",
    email: "hoangvanem@gmail.com",
    isActive: true,
  },
];

interface CustomerSelectProps {
  value?: string;
  onSelect: (customer: Customer) => void;
}

export function CustomerSelect({ value, onSelect }: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const selected = MOCK_CUSTOMERS.find((c) => c.id === value);

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
            <span className="text-slate-400">Chọn khách hàng...</span>
          )}
          <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <div className="flex items-center border-b border-slate-200 px-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Tìm theo tên, SĐT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 h-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Không tìm thấy khách hàng
            </div>
          ) : (
            filtered.map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  onSelect(customer);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm text-slate-700">{customer.name}</p>
                  {customer.phone && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {customer.phone}
                      {customer.email && ` · ${customer.email}`}
                    </p>
                  )}
                </div>
                {value === customer.id && (
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
