// src/app/(dashboard)/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
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
    id: "3",
    name: "Lê Văn Cường",
    phone: "0934567890",
    email: "levancuong@gmail.com",
    isActive: false,
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

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [isLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

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

  function handleSheetSuccess(customer?: Customer) {
    if (editCustomer) {
      setAllCustomers((prev) =>
        prev.map((c) => (c.id === editCustomer.id ? { ...c, ...customer } : c)),
      );
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: customer?.name ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        isActive: true,
      };
      setAllCustomers((prev) => [newCustomer, ...prev]);
    }
    setSheetOpen(false);
  }

  function handleDeleteSuccess() {
    if (deleteCustomer) {
      setAllCustomers((prev) => prev.filter((c) => c.id !== deleteCustomer.id));
    }
    setDeleteOpen(false);
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
