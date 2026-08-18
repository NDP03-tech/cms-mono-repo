// src/components/features/inventory/inventory-list.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { inventoryService } from "@/services/inventory.service";
import {
  InventoryBalance,
  InventoryTransaction,
} from "@/types/inventory.types";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InventoryBalanceTable } from "./inventory-balance-table";
import { InventoryTransactionTable } from "./inventory-transaction-table";
import { AdjustInventoryDialog } from "./adjust-inventory-dialog";

export function InventoryList() {
  const [balances, setBalances] = useState<InventoryBalance[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [adjustTarget, setAdjustTarget] = useState<InventoryBalance | null>(
    null,
  );

  const fetchBalances = useCallback(async () => {
    setIsLoadingBalances(true);
    try {
      const data = await inventoryService.listBalances();
      setBalances(data ?? []);
      setError(null);
    } catch (err) {
      console.error("Failed to load inventory balances:", err);
      setError("Không thể tải dữ liệu tồn kho. Vui lòng thử lại sau.");
    } finally {
      setIsLoadingBalances(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      const data = await inventoryService.listTransactions();
      setTransactions(data ?? []);
    } catch (err) {
      console.error("Failed to load inventory transactions:", err);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBalances();
    fetchTransactions();
  }, [fetchBalances, fetchTransactions]);

  const filteredBalances = useMemo(() => {
    if (!search) return balances;
    const q = search.toLowerCase();
    return balances.filter(
      (b) =>
        b.productName.toLowerCase().includes(q) ||
        b.productSku.toLowerCase().includes(q),
    );
  }, [balances, search]);

  function handleAdjustSuccess() {
    // Load lại cả 2 tab: balance mới sau khi điều chỉnh,
    // và transaction "adjustment" vừa được BE tạo thêm.
    fetchBalances();
    fetchTransactions();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Tồn kho</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Theo dõi tồn kho hiện tại và lịch sử xuất nhập.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Tabs defaultValue="balances">
        <TabsList>
          <TabsTrigger value="balances">Tồn kho hiện tại</TabsTrigger>
          <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4 pt-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 border-slate-200 pl-9 text-sm"
            />
          </div>

          <InventoryBalanceTable
            balances={filteredBalances}
            isLoading={isLoadingBalances}
            onAdjust={setAdjustTarget}
          />
        </TabsContent>

        <TabsContent value="transactions" className="pt-4">
          <InventoryTransactionTable
            transactions={transactions}
            isLoading={isLoadingTransactions}
          />
        </TabsContent>
      </Tabs>

      <AdjustInventoryDialog
        open={!!adjustTarget}
        onClose={() => setAdjustTarget(null)}
        balance={adjustTarget}
        onSuccess={handleAdjustSuccess}
      />
    </div>
  );
}
