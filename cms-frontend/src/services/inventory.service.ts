// src/services/inventory.service.ts
import api from "@/lib/axios";
import {
  InventoryBalance,
  InventoryTransaction,
  InventoryBalanceFilters,
  InventoryTransactionFilters,
  AdjustInventoryInput,
} from "@/types/inventory.types";

export const inventoryService = {
  async listBalances(
    filters?: InventoryBalanceFilters,
  ): Promise<InventoryBalance[]> {
    const { data } = await api.get("/inventory/balances", { params: filters });
    return data;
  },

  async getBalance(productId: string): Promise<InventoryBalance> {
    const { data } = await api.get(`/inventory/balances/${productId}`);
    return data;
  },

  async listTransactions(
    filters?: InventoryTransactionFilters,
  ): Promise<InventoryTransaction[]> {
    const { data } = await api.get("/inventory/transactions", {
      params: filters,
    });
    return data;
  },

  async adjust(input: AdjustInventoryInput): Promise<void> {
    await api.patch("/inventory/balances/adjust", input);
  },
};
