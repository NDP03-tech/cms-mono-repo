// src/services/product.service.ts
import api from "@/lib/axios";
import {
  Product,
  ProductFilters,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product.types";

export const productService = {
  async list(filters?: ProductFilters): Promise<Product[]> {
    const { data } = await api.get("/products", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  async create(input: CreateProductInput): Promise<string> {
    const { data } = await api.post("/products", input);
    return data.id;
  },

  async update(id: string, input: UpdateProductInput): Promise<void> {
    await api.patch(`/products/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
