// src/app/(dashboard)/suppliers/page.tsx
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
import { SupplierTable } from "@/components/features/suppliers/supplier-table";
import { SupplierSheet } from "@/components/features/suppliers/supplier-sheet";
import { SupplierDeleteDialog } from "@/components/features/suppliers/supplier-delete-dialog";
import { Supplier } from "@/types/supplier.types";
import { supplierService } from "@/services/supplier.service";
import { useIsAdmin } from "@/hooks/use-current-user";

export default function SuppliersPage() {
  const isAdmin = useIsAdmin();
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await supplierService.list();
      setAllSuppliers(data ?? []);
    } catch {
      setAllSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

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

  async function handleSheetSuccess() {
    setSheetOpen(false);
    await fetchSuppliers();
  }

  async function handleDeleteSuccess() {
    setDeleteOpen(false);
    await fetchSuppliers();
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
          hidden={!isAdmin}
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
        canManage={isAdmin}
      />

      {/* Sheet */}
      <SupplierSheet
        open={isAdmin && sheetOpen}
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
