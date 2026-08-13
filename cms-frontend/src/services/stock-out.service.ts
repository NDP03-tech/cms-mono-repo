// src/services/stock-out.service.ts

import api from "@/lib/axios";

import type {
  StockOut,
  StockOutFilters,
  CreateStockOutInput,
  CreateStockOutItemInput,
  UpdateStockOutItemInput,
} from "@/types/stock-out.types";

export const stockOutService = {
  // ============================================================
  // QUERY
  // ============================================================

  async list(filters?: StockOutFilters): Promise<StockOut[]> {
    // Không gửi các query param rỗng: undefined / null / ""
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    const { data } = await api.get<StockOut[]>("/stock-out", { params });

    return data ?? [];
  },

  async getById(id: string): Promise<StockOut> {
    const { data } = await api.get<StockOut>(`/stock-out/${id}`);

    return data;
  },

  // ============================================================
  // CREATE
  // ============================================================

  /**
   * Tạo một phiếu xuất ở trạng thái DRAFT.
   * Lưu ý: BE trả về id dạng string thuần (không phải { id }),
   * nên KHÔNG được đọc data.id ở đây.
   */
  async create(input: CreateStockOutInput): Promise<string> {
    const { data } = await api.post<string>("/stock-out", input);

    return data;
  },

  // ============================================================
  // ITEMS
  // ============================================================

  async addItem(
    stockOutId: string,
    input: CreateStockOutItemInput,
  ): Promise<StockOut | undefined> {
    const { data } = await api.post<StockOut>(
      `/stock-out/${stockOutId}/items`,
      input,
    );

    return data;
  },

  async updateItem(
    stockOutId: string,
    itemId: string,
    input: UpdateStockOutItemInput,
  ): Promise<StockOut | undefined> {
    const { data } = await api.patch<StockOut>(
      `/stock-out/${stockOutId}/items/${itemId}`,
      input,
    );

    return data;
  },

  async removeItem(
    stockOutId: string,
    itemId: string,
  ): Promise<StockOut | undefined> {
    const { data } = await api.delete<StockOut>(
      `/stock-out/${stockOutId}/items/${itemId}`,
    );

    return data;
  },

  // ============================================================
  // STATUS
  // ============================================================

  async submit(id: string): Promise<StockOut | undefined> {
    const { data } = await api.patch<StockOut>(`/stock-out/${id}/submit`);

    return data;
  },

  async approve(id: string): Promise<StockOut | undefined> {
    const { data } = await api.patch<StockOut>(`/stock-out/${id}/approve`);

    return data;
  },

  async reject(id: string): Promise<StockOut | undefined> {
    const { data } = await api.patch<StockOut>(`/stock-out/${id}/reject`);

    return data;
  },
};
