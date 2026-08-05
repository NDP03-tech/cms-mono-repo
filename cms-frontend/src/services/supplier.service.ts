// src/services/supplier.service.ts
import api from "@/lib/axios";
import {
  Supplier,
  SupplierFilters,
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@/types/supplier.types";

export const supplierService = {
  async list(filters?: SupplierFilters): Promise<Supplier[]> {
    const { data } = await api.get("/suppliers", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Supplier> {
    const { data } = await api.get(`/suppliers/${id}`);
    return data;
  },

  async create(input: CreateSupplierInput): Promise<string> {
    const { data } = await api.post("/suppliers", input);
    return data.id;
  },

  async update(id: string, input: UpdateSupplierInput): Promise<void> {
    await api.patch(`/suppliers/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  },
};
