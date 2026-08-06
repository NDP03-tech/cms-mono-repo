// src/app/(dashboard)/stock-out/page.tsx
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
import { StockOutTable } from "@/components/features/stock-out/stock-out-table";
import { StockOut, StockOutStatus } from "@/types/stock-out.types";

const MOCK_STOCK_OUTS: StockOut[] = [
  {
    id: "1",
    code: "PX-20240115-001",
    customerId: "1",
    customerName: "Nguyễn Văn An",
    createdBy: "admin",
    status: "approved",
    totalAmount: 2000000,
    currency: "VND",
    items: [
      {
        id: "i1",
        productId: "1",
        productName: "Áo thun nam cổ tròn",
        productSku: "SP-001",
        quantity: 10,
        unitPrice: 200000,
        currency: "VND",
        totalPrice: 2000000,
      },
    ],
    approvedAt: "2024-01-15T11:00:00Z",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    code: "PX-20240116-001",
    customerId: "2",
    customerName: "Trần Thị Bình",
    createdBy: "admin",
    status: "pending",
    totalAmount: 3500000,
    currency: "VND",
    items: [
      {
        id: "i2",
        productId: "2",
        productName: "Quần jean nam slim fit",
        productSku: "SP-002",
        quantity: 7,
        unitPrice: 500000,
        currency: "VND",
        totalPrice: 3500000,
      },
    ],
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    code: "PX-20240117-001",
    customerId: "4",
    customerName: "Phạm Thị Dung",
    createdBy: "admin",
    status: "draft",
    totalAmount: 5250000,
    currency: "VND",
    items: [
      {
        id: "i3",
        productId: "3",
        productName: "Giày thể thao Nike",
        productSku: "SP-003",
        quantity: 5,
        unitPrice: 950000,
        currency: "VND",
        totalPrice: 4750000,
      },
      {
        id: "i4",
        productId: "5",
        productName: "Mũ lưỡi trai",
        productSku: "SP-006",
        quantity: 5,
        unitPrice: 100000,
        currency: "VND",
        totalPrice: 500000,
      },
    ],
    createdAt: "2024-01-17T08:00:00Z",
  },
  {
    id: "4",
    code: "PX-20240114-001",
    customerId: "5",
    customerName: "Hoàng Văn Em",
    createdBy: "admin",
    status: "rejected",
    totalAmount: 12000000,
    currency: "VND",
    items: [
      {
        id: "i5",
        productId: "4",
        productName: "Túi xách da thật",
        productSku: "SP-005",
        quantity: 8,
        unitPrice: 1500000,
        currency: "VND",
        totalPrice: 12000000,
      },
    ],
    createdAt: "2024-01-14T09:00:00Z",
  },
];

export default function StockOutPage() {
  const [allStockOuts] = useState<StockOut[]>(MOCK_STOCK_OUTS);
  const [stockOuts, setStockOuts] = useState<StockOut[]>(MOCK_STOCK_OUTS);
  const [isLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = allStockOuts;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.status === (statusFilter as StockOutStatus),
      );
    }

    setStockOuts(filtered);
  }, [search, statusFilter, allStockOuts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Phiếu xuất kho
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý phiếu xuất hàng cho khách hàng
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Link href="/stock-out/new">
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu xuất
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo mã phiếu, khách hàng..."
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
          {stockOuts.length} phiếu xuất
        </p>
      </div>

      <StockOutTable stockOuts={stockOuts} isLoading={isLoading} />
    </div>
  );
}
