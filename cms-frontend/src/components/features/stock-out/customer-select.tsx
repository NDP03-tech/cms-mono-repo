// src/components/features/stock-out/customer-select.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Search,
  Plus,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Customer } from "@/types/customer.types";
import { customerService } from "@/services/customer.service";

interface CustomerSelectProps {
  value?: string;
  onSelect: (customer: Customer) => void;
}

export function CustomerSelect({ value, onSelect }: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Chế độ tạo nhanh khách hàng ngay trong popover — gọi thẳng
  // customerService.create() nên khách hàng tạo ra là THẬT, lưu vào DB
  // (khác với Product bên dưới, vì Product chưa có API create xác nhận).
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await customerService.list();
        setCustomers(data ?? []);
      } catch (error) {
        console.error("Failed to load customers:", error);
        setLoadError("Không tải được danh sách khách hàng.");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filtered = customers.filter((customer) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.phone?.includes(search) ||
      customer.email?.toLowerCase().includes(q) ||
      customer.address?.toLowerCase().includes(q)
    );
  });

  const selected = customers.find((customer) => customer.id === value);

  function openCreateForm() {
    setCreating(true);
    setNewName(search);
    setNewPhone("");
    setNewEmail("");
    setNewAddress("");
    setCreateError(null);
  }

  async function handleCreate() {
    if (!newName.trim()) {
      setCreateError("Vui lòng nhập tên khách hàng.");
      return;
    }
    setSubmittingCreate(true);
    setCreateError(null);
    try {
      const id = await customerService.create({
        name: newName.trim(),
        phone: newPhone.trim() || undefined,
        email: newEmail.trim() || undefined,
        address: newAddress.trim() || undefined,
      });
      const created: Customer = {
        id,
        name: newName.trim(),
        phone: newPhone.trim() || undefined,
        email: newEmail.trim() || undefined,
        address: newAddress.trim() || undefined,
        isActive: true,
      };
      setCustomers((prev) => [created, ...prev]);
      onSelect(created);
      setOpen(false);
      setCreating(false);
      setSearch("");
    } catch (err: any) {
      setCreateError(
        err?.response?.data?.message ??
          "Không thể tạo khách hàng. Kiểm tra lại kết nối API.",
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
        {creating ? (
          <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
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
                Thêm khách hàng mới
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tên khách hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Nguyễn Văn An"
                className="h-9 border-slate-200 text-sm"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Số điện thoại
              </Label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="0901234567"
                className="h-9 border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Email
              </Label>
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-9 border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Địa chỉ
              </Label>
              <Textarea
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows={2}
                className="resize-none border-slate-200 text-sm"
              />
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
                placeholder="Tìm theo tên, SĐT, email, địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 h-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto">
              {loading ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Đang tải khách hàng...
                </div>
              ) : loadError ? (
                <div className="py-6 text-center text-xs text-red-500 px-4">
                  {loadError}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Không tìm thấy khách hàng
                </div>
              ) : (
                filtered.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      onSelect(customer);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700">{customer.name}</p>
                      {(customer.phone || customer.email) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {customer.phone}
                          {customer.phone && customer.email && " · "}
                          {customer.email}
                        </p>
                      )}
                      {customer.address && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {customer.address}
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

            <div className="border-t border-slate-200 p-1.5">
              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors text-left text-sm text-slate-700"
              >
                <Plus className="h-4 w-4 text-slate-500" />
                Thêm khách hàng mới{search ? `: "${search}"` : ""}
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
