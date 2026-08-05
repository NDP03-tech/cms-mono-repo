// src/services/stock-in.service.ts
import api from "@/lib/axios";
import {
  StockIn,
  StockInFilters,
  CreateStockInInput,
  CreateStockInItemInput,
} from "@/types/stock-in.types";

export const stockInService = {
  async list(filters?: StockInFilters): Promise<StockIn[]> {
    const { data } = await api.get("/stock-in", { params: filters });
    return data;
  },

  async getById(id: string): Promise<StockIn> {
    const { data } = await api.get(`/stock-in/${id}`);
    return data;
  },

  async create(input: CreateStockInInput): Promise<string> {
    const { data } = await api.post("/stock-in", input);
    return data.id;
  },

  async addItem(
    stockInId: string,
    input: CreateStockInItemInput,
  ): Promise<void> {
    await api.post(`/stock-in/${stockInId}/items`, input);
  },

  async updateItem(
    stockInId: string,
    itemId: string,
    input: Partial<CreateStockInItemInput>,
  ): Promise<void> {
    await api.patch(`/stock-in/${stockInId}/items/${itemId}`, input);
  },

  async removeItem(stockInId: string, itemId: string): Promise<void> {
    await api.delete(`/stock-in/${stockInId}/items/${itemId}`);
  },

  async submit(id: string): Promise<void> {
    await api.patch(`/stock-in/${id}/submit`);
  },

  async approve(id: string): Promise<void> {
    await api.patch(`/stock-in/${id}/approve`);
  },

  async reject(id: string): Promise<void> {
    await api.patch(`/stock-in/${id}/reject`);
  },
};
