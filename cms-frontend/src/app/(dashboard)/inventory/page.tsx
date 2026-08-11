"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InventoryBalanceTable } from "@/components/features/inventory/inventory-balance-table";
import { InventoryTransactionTable } from "@/components/features/inventory/inventory-transaction-table";
import { AdjustInventoryDialog } from "@/components/features/inventory/adjust-inventory-dialog";

import {
  InventoryBalance,
  InventoryTransaction,
} from "@/types/inventory.types";

import { inventoryService } from "@/services/inventory.service";

export default function InventoryPage() {
  const [allBalances, setAllBalances] = useState<InventoryBalance[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [adjustBalance, setAdjustBalance] = useState<InventoryBalance | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      setIsLoading(true);

      try {
        const [balancesData, transactionsData] = await Promise.all([
          inventoryService.listBalances(),
          inventoryService.listTransactions(),
        ]);

        if (cancelled) return;

        setAllBalances(balancesData ?? []);
        setTransactions(transactionsData ?? []);
      } catch {
        if (cancelled) return;

        setAllBalances([]);
        setTransactions([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  const balances = allBalances.filter((balance) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      balance.productName.toLowerCase().includes(query) ||
      balance.productSku.toLowerCase().includes(query)
    );
  });

  const handleAdjustSuccess = (productId: string, newQuantity: number) => {
    setAllBalances((prev) =>
      prev.map((balance) =>
        balance.productId === productId
          ? {
              ...balance,
              quantity: newQuantity,
              updatedAt: new Date().toISOString(),
            }
          : balance,
      ),
    );

    setAdjustBalance(null);
  };

  const totalSkus = allBalances.length;

  const outOfStock = allBalances.filter(
    (balance) => balance.quantity <= 0,
  ).length;

  const lowStock = allBalances.filter(
    (balance) => balance.quantity > 0 && balance.quantity <= 5,
  ).length;

  const totalIn = transactions
    .filter((transaction) => transaction.type === "stock_in")
    .reduce((sum, transaction) => sum + transaction.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Tồn kho</h1>

        <p className="mt-0.5 text-sm text-slate-500">
          Theo dõi số lượng tồn kho và lịch sử giao dịch
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">SKU đang theo dõi</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalSkus}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Hết hàng</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {outOfStock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Sắp cạn</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {lowStock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Nhập hàng tổng</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalIn}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Tìm sản phẩm hoặc SKU..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="balances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balances">Tồn kho</TabsTrigger>

          <TabsTrigger value="transactions">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          <InventoryBalanceTable
            balances={balances}
            isLoading={isLoading}
            onAdjust={setAdjustBalance}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <InventoryTransactionTable
            transactions={transactions}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <AdjustInventoryDialog
        balance={adjustBalance}
        open={!!adjustBalance}
        onSuccess={handleAdjustSuccess}
      />
    </div>
  );
}
