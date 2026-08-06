// src/app/(dashboard)/inventory/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryBalanceTable } from "@/components/features/inventory/inventory-balance-table";
import { InventoryTransactionTable } from "@/components/features/inventory/inventory-transaction-table";
import { AdjustInventoryDialog } from "@/components/features/inventory/adjust-inventory-dialog";
import {
  InventoryBalance,
  InventoryTransaction,
} from "@/types/inventory.types";

const MOCK_BALANCES: InventoryBalance[] = [
  {
    id: "1",
    productId: "1",
    productName: "Áo thun nam cổ tròn",
    productSku: "SP-001",
    productUnit: "cái",
    quantity: 87,
    updatedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "2",
    productId: "2",
    productName: "Quần jean nam slim fit",
    productSku: "SP-002",
    productUnit: "cái",
    quantity: 43,
    updatedAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "3",
    productId: "3",
    productName: "Giày thể thao Nike",
    productSku: "SP-003",
    productUnit: "đôi",
    quantity: 3,
    updatedAt: "2024-01-17T08:00:00Z",
  },
  {
    id: "4",
    productId: "4",
    productName: "Túi xách da thật",
    productSku: "SP-005",
    productUnit: "cái",
    quantity: 0,
    updatedAt: "2024-01-14T08:00:00Z",
  },
  {
    id: "5",
    productId: "5",
    productName: "Mũ lưỡi trai",
    productSku: "SP-006",
    productUnit: "cái",
    quantity: 5,
    updatedAt: "2024-01-17T08:00:00Z",
  },
];

const MOCK_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: "t1",
    productId: "1",
    productName: "Áo thun nam cổ tròn",
    productSku: "SP-001",
    type: "stock_in",
    quantity: 100,
    referenceId: "abc-001",
    referenceType: "stock_in",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "t2",
    productId: "1",
    productName: "Áo thun nam cổ tròn",
    productSku: "SP-001",
    type: "stock_out",
    quantity: 10,
    referenceId: "def-001",
    referenceType: "stock_out",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "t3",
    productId: "2",
    productName: "Quần jean nam slim fit",
    productSku: "SP-002",
    type: "stock_in",
    quantity: 50,
    referenceId: "abc-002",
    referenceType: "stock_in",
    createdAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "t4",
    productId: "2",
    productName: "Quần jean nam slim fit",
    productSku: "SP-002",
    type: "stock_out",
    quantity: 7,
    referenceId: "def-002",
    referenceType: "stock_out",
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "t5",
    productId: "3",
    productName: "Giày thể thao Nike",
    productSku: "SP-003",
    type: "stock_in",
    quantity: 5,
    referenceId: "abc-003",
    referenceType: "stock_in",
    createdAt: "2024-01-17T08:00:00Z",
  },
  {
    id: "t6",
    productId: "3",
    productName: "Giày thể thao Nike",
    productSku: "SP-003",
    type: "adjustment",
    quantity: 2,
    referenceId: "adj-001",
    referenceType: "adjustment",
    createdAt: "2024-01-17T09:00:00Z",
  },
];

export default function InventoryPage() {
  const [allBalances, setAllBalances] =
    useState<InventoryBalance[]>(MOCK_BALANCES);
  const [balances, setBalances] = useState<InventoryBalance[]>(MOCK_BALANCES);
  const [transactions] = useState<InventoryTransaction[]>(MOCK_TRANSACTIONS);
  const [isLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [adjustBalance, setAdjustBalance] = useState<InventoryBalance | null>(
    null,
  );

  useEffect(() => {
    if (!search) {
      setBalances(allBalances);
      return;
    }
    const q = search.toLowerCase();
    setBalances(
      allBalances.filter(
        (b) =>
          b.productName.toLowerCase().includes(q) ||
          b.productSku.toLowerCase().includes(q),
      ),
    );
  }, [search, allBalances]);

  function handleAdjustSuccess(productId: string, newQuantity: number) {
    setAllBalances((prev) =>
      prev.map((b) =>
        b.productId === productId
          ? { ...b, quantity: newQuantity, updatedAt: new Date().toISOString() }
          : b,
      ),
    );
  }

  // Stats
  const totalSkus = allBalances.length;
  const outOfStock = allBalances.filter((b) => b.quantity <= 0).length;
  const lowStock = allBalances.filter(
    (b) => b.quantity > 0 && b.quantity <= 5,
  ).length;
  const totalIn = MOCK_TRANSACTIONS.filter((t) => t.type === "stock_in").reduce(
    (sum, t) => sum + t.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Tồn kho</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Theo dõi số lượng tồn kho và lịch sử giao dịch
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tổng SKU
            </p>
            <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-3">
            {totalSkus}
          </p>
          <p className="text-xs text-slate-400 mt-1">sản phẩm đang quản lý</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Hết hàng
            </p>
            <div className="h-8 w-8 rounded-md bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-red-600 mt-3">
            {outOfStock}
          </p>
          <p className="text-xs text-slate-400 mt-1">sản phẩm hết hàng</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Sắp hết
            </p>
            <div className="h-8 w-8 rounded-md bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-amber-600 mt-3">
            {lowStock}
          </p>
          <p className="text-xs text-slate-400 mt-1">sản phẩm tồn kho thấp</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tổng nhập
            </p>
            <div className="h-8 w-8 rounded-md bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-emerald-600 mt-3">
            {totalIn}
          </p>
          <p className="text-xs text-slate-400 mt-1">đơn vị đã nhập kho</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="balances">
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-100 p-1 h-9">
            <TabsTrigger value="balances" className="text-xs h-7 px-3">
              Tồn kho hiện tại
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs h-7 px-3">
              Lịch sử giao dịch
            </TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm border-slate-200"
            />
          </div>
        </div>

        <TabsContent value="balances" className="mt-4">
          <InventoryBalanceTable
            balances={balances}
            isLoading={isLoading}
            onAdjust={setAdjustBalance}
          />
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <InventoryTransactionTable
            transactions={transactions}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Adjust dialog */}
      <AdjustInventoryDialog
        open={!!adjustBalance}
        onClose={() => setAdjustBalance(null)}
        onSuccess={handleAdjustSuccess}
        balance={adjustBalance}
      />
    </div>
  );
}
