"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Supplier } from "@/types/supplier.types";
import { supplierService } from "@/services/supplier.service";

interface SupplierPickerProps {
  value?: string;
  onChange: (supplierId: string, supplier?: Supplier) => void;
  disabled?: boolean;
}

export function SupplierPicker({
  value,
  onChange,
  disabled = false,
}: SupplierPickerProps) {
  const [open, setOpen] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSuppliers() {
      setLoading(true);

      try {
        const data = await supplierService.list({
          isActive: true,
          search: search || undefined,
        });

        setSuppliers(data);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadSuppliers, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const selectedSupplier = suppliers.find((supplier) => supplier.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-10 w-full justify-between border-slate-200 font-normal"
        >
          {selectedSupplier ? (
            <div className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm text-slate-900">
                {selectedSupplier.name}
              </span>

              {selectedSupplier.phone && (
                <span className="text-xs text-slate-400">
                  {selectedSupplier.phone}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">Chọn nhà cung cấp...</span>
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm nhà cung cấp..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            ) : suppliers.length === 0 ? (
              <CommandEmpty>Không tìm thấy nhà cung cấp.</CommandEmpty>
            ) : (
              <CommandGroup heading="Nhà cung cấp">
                {suppliers.map((supplier) => (
                  <CommandItem
                    key={supplier.id}
                    value={supplier.id}
                    onSelect={() => {
                      onChange(supplier.id, supplier);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === supplier.id ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        {supplier.name}
                      </span>

                      <span className="text-xs text-slate-400">
                        {[supplier.phone, supplier.email]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
