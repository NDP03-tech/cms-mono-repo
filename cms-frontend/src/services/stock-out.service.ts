// src/services/stock-out.service.ts
import api from "@/lib/axios";
import {
  StockOut,
  StockOutFilters,
  CreateStockOutInput,
  CreateStockOutItemInput,
} from "@/types/stock-out.types";

export const stockOutService = {
  async list(filters?: StockOutFilters): Promise<StockOut[]> {
    const { data } = await api.get("/stock-out", { params: filters });
    return data;
  },

  async getById(id: string): Promise<StockOut> {
    const { data } = await api.get(`/stock-out/${id}`);
    return data;
  },

  async create(input: CreateStockOutInput): Promise<string> {
    const { data } = await api.post("/stock-out", input);
    return data.id;
  },

  async addItem(
    stockOutId: string,
    input: CreateStockOutItemInput,
  ): Promise<void> {
    await api.post(`/stock-out/${stockOutId}/items`, input);
  },

  async updateItem(
    stockOutId: string,
    itemId: string,
    input: Partial<CreateStockOutItemInput>,
  ): Promise<void> {
    await api.patch(`/stock-out/${stockOutId}/items/${itemId}`, input);
  },

  async removeItem(stockOutId: string, itemId: string): Promise<void> {
    await api.delete(`/stock-out/${stockOutId}/items/${itemId}`);
  },

  async submit(id: string): Promise<void> {
    await api.patch(`/stock-out/${id}/submit`);
  },

  async approve(id: string): Promise<void> {
    await api.patch(`/stock-out/${id}/approve`);
  },

  async reject(id: string): Promise<void> {
    await api.patch(`/stock-out/${id}/reject`);
  },
};
