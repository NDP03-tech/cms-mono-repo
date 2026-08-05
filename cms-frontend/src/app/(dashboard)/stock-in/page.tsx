// src/app/(dashboard)/stock-in/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { StockInTable } from "@/components/features/stock-in/stock-in-table";
import { StockIn, StockInStatus } from "@/types/stock-in.types";

const MOCK_STOCK_INS: StockIn[] = [
  {
    id: "1",
    code: "PN-20240115-001",
    supplierId: "1",
    supplierName: "Công ty TNHH Dệt may Hà Nội",
    createdBy: "admin",
    status: "approved",
    totalAmount: 15000000,
    currency: "VND",
    items: [
      {
        id: "i1",
        productId: "1",
        productName: "Áo thun nam cổ tròn",
        productSku: "SP-001",
        quantity: 100,
        unitPrice: 150000,
        currency: "VND",
        totalPrice: 15000000,
      },
    ],
    approvedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    code: "PN-20240116-001",
    supplierId: "2",
    supplierName: "Xưởng may Sài Gòn",
    createdBy: "admin",
    status: "pending",
    totalAmount: 17500000,
    currency: "VND",
    items: [
      {
        id: "i2",
        productId: "2",
        productName: "Quần jean nam slim fit",
        productSku: "SP-002",
        quantity: 50,
        unitPrice: 350000,
        currency: "VND",
        totalPrice: 17500000,
      },
    ],
    createdAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "3",
    code: "PN-20240117-001",
    supplierId: "1",
    supplierName: "Công ty TNHH Dệt may Hà Nội",
    createdBy: "admin",
    status: "draft",
    totalAmount: 4750000,
    currency: "VND",
    items: [
      {
        id: "i3",
        productId: "3",
        productName: "Giày thể thao Nike",
        productSku: "SP-003",
        quantity: 5,
        unitPrice: 850000,
        currency: "VND",
        totalPrice: 4250000,
      },
      {
        id: "i4",
        productId: "5",
        productName: "Mũ lưỡi trai",
        productSku: "SP-006",
        quantity: 5,
        unitPrice: 95000,
        currency: "VND",
        totalPrice: 475000,
      },
    ],
    createdAt: "2024-01-17T07:00:00Z",
  },
  {
    id: "4",
    code: "PN-20240114-001",
    supplierId: "2",
    supplierName: "Xưởng may Sài Gòn",
    createdBy: "admin",
    status: "rejected",
    totalAmount: 60000000,
    currency: "VND",
    items: [
      {
        id: "i5",
        productId: "4",
        productName: "Túi xách da thật",
        productSku: "SP-005",
        quantity: 50,
        unitPrice: 1200000,
        currency: "VND",
        totalPrice: 60000000,
      },
    ],
    createdAt: "2024-01-14T08:00:00Z",
  },
];

export default function StockInPage() {
  const [allStockIns] = useState<StockIn[]>(MOCK_STOCK_INS);
  const [stockIns, setStockIns] = useState<StockIn[]>(MOCK_STOCK_INS);
  const [isLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = allStockIns;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.supplierName.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.status === (statusFilter as StockInStatus),
      );
    }

    setStockIns(filtered);
  }, [search, statusFilter, allStockIns]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Phiếu nhập kho
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý phiếu nhập hàng từ nhà cung cấp
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Link href="/stock-in/new">
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu nhập
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo mã phiếu, nhà cung cấp..."
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
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 ml-auto">
          {stockIns.length} phiếu nhập
        </p>
      </div>

      {/* Table */}
      <StockInTable stockIns={stockIns} isLoading={isLoading} />
    </div>
  );
}
