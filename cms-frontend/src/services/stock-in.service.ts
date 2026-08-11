// src/services/stock-in.service.ts

import api from "@/lib/axios";

import type {
  StockIn,
  StockInFilters,
  CreateStockInInput,
  CreateStockInItemInput,
  UpdateStockInItemInput,
} from "@/types/stock-in.types";

export const stockInService = {
  // ============================================================
  // QUERY
  // ============================================================

  async list(filters?: StockInFilters): Promise<StockIn[]> {
    const { data } = await api.get<StockIn[]>("/stock-in", {
      params: filters,
    });

    return data ?? [];
  },

  async getById(id: string): Promise<StockIn> {
    const { data } = await api.get<StockIn>(`/stock-in/${id}`);

    return data;
  },

  // ============================================================
  // CREATE
  // ============================================================

  /**
   * Tạo một phiếu nhập ở trạng thái DRAFT.
   */
  async create(input: CreateStockInInput): Promise<string> {
    const { data } = await api.post<string>("/stock-in", input);

    return data;
  },

  // ============================================================
  // ITEMS
  // ============================================================

  async addItem(
    stockInId: string,
    input: CreateStockInItemInput,
  ): Promise<StockIn | undefined> {
    const { data } = await api.post<StockIn>(
      `/stock-in/${stockInId}/items`,
      input,
    );

    return data;
  },

  async updateItem(
    stockInId: string,
    itemId: string,
    input: UpdateStockInItemInput,
  ): Promise<StockIn | undefined> {
    const { data } = await api.patch<StockIn>(
      `/stock-in/${stockInId}/items/${itemId}`,
      input,
    );

    return data;
  },

  async removeItem(
    stockInId: string,
    itemId: string,
  ): Promise<StockIn | undefined> {
    const { data } = await api.delete<StockIn>(
      `/stock-in/${stockInId}/items/${itemId}`,
    );

    return data;
  },

  // ============================================================
  // STATUS
  // ============================================================

  async submit(id: string): Promise<StockIn | undefined> {
    const { data } = await api.patch<StockIn>(`/stock-in/${id}/submit`);

    return data;
  },

  async approve(id: string): Promise<StockIn | undefined> {
    const { data } = await api.patch<StockIn>(`/stock-in/${id}/approve`);

    return data;
  },

  async reject(id: string): Promise<StockIn | undefined> {
    const { data } = await api.patch<StockIn>(`/stock-in/${id}/reject`);

    return data;
  },
};
