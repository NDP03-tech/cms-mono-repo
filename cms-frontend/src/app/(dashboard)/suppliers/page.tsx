// src/app/(dashboard)/suppliers/page.tsx
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
import { SupplierTable } from "@/components/features/suppliers/supplier-table";
import { SupplierSheet } from "@/components/features/suppliers/supplier-sheet";
import { SupplierDeleteDialog } from "@/components/features/suppliers/supplier-delete-dialog";
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
    id: "3",
    name: "Nhà cung cấp ABC",
    phone: "0912345678",
    email: "abc@supplier.vn",
    address: "789 Trần Hưng Đạo, Đà Nẵng",
    isActive: false,
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

export default function SuppliersPage() {
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    let filtered = allSuppliers;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.email?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) =>
        statusFilter === "active" ? s.isActive : !s.isActive,
      );
    }

    setSuppliers(filtered);
  }, [search, statusFilter, allSuppliers]);

  function handleEdit(supplier: Supplier) {
    setEditSupplier(supplier);
    setSheetOpen(true);
  }

  function handleDelete(supplier: Supplier) {
    setDeleteSupplier(supplier);
    setDeleteOpen(true);
  }

  function handleAddNew() {
    setEditSupplier(null);
    setSheetOpen(true);
  }

  function handleSheetSuccess(supplier?: Supplier) {
    if (editSupplier) {
      setAllSuppliers((prev) =>
        prev.map((s) => (s.id === editSupplier.id ? { ...s, ...supplier } : s)),
      );
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        name: supplier?.name ?? "",
        phone: supplier?.phone ?? "",
        email: supplier?.email ?? "",
        address: supplier?.address ?? "",
        isActive: true,
      };
      setAllSuppliers((prev) => [newSupplier, ...prev]);
    }
    setSheetOpen(false);
  }

  function handleDeleteSuccess() {
    if (deleteSupplier) {
      setAllSuppliers((prev) => prev.filter((s) => s.id !== deleteSupplier.id));
    }
    setDeleteOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Nhà cung cấp</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý danh sách nhà cung cấp
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhà cung cấp
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
            <SelectItem value="inactive">Ngừng hợp tác</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 ml-auto">
          {suppliers.length} nhà cung cấp
        </p>
      </div>

      {/* Table */}
      <SupplierTable
        suppliers={suppliers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Sheet */}
      <SupplierSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSuccess={handleSheetSuccess}
        supplier={editSupplier}
      />

      {/* Delete Dialog */}
      <SupplierDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
        supplier={deleteSupplier}
      />
    </div>
  );
}
