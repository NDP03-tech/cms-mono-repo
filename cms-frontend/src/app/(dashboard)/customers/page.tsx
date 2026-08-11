// src/app/(dashboard)/customers/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerTable } from "@/components/features/customers/customer-table";
import { CustomerSheet } from "@/components/features/customers/customer-sheet";
import { CustomerDeleteDialog } from "@/components/features/customers/customer-delete-dialog";
import { Customer } from "@/types/customer.types";
import { customerService } from "@/services/customer.service";

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await customerService.list();
      setAllCustomers(data ?? []);
    } catch {
      setAllCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    let filtered = allCustomers;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.email?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) =>
        statusFilter === "active" ? c.isActive : !c.isActive,
      );
    }

    setCustomers(filtered);
  }, [search, statusFilter, allCustomers]);

  function handleEdit(customer: Customer) {
    setEditCustomer(customer);
    setSheetOpen(true);
  }

  function handleDelete(customer: Customer) {
    setDeleteCustomer(customer);
    setDeleteOpen(true);
  }

  function handleAddNew() {
    setEditCustomer(null);
    setSheetOpen(true);
  }

  async function handleSheetSuccess() {
    await fetchCustomers();
    setSheetOpen(false);
  }

  async function handleDeleteSuccess() {
    setDeleteOpen(false);
    await fetchCustomers();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Khách hàng</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý danh sách khách hàng
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm khách hàng
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên, SĐT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm border-slate-200">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng giao dịch</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 ml-auto">
          {customers.length} khách hàng
        </p>
      </div>

      {/* Table */}
      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Sheet */}
      <CustomerSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSuccess={handleSheetSuccess}
        customer={editCustomer}
      />

      {/* Delete Dialog */}
      <CustomerDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
        customer={deleteCustomer}
      />
    </div>
  );
}
