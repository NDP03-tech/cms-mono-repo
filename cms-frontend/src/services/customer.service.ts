// src/services/customer.service.ts
import api from "@/lib/axios";
import {
  Customer,
  CustomerFilters,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/types/customer.types";

export const customerService = {
  async list(filters?: CustomerFilters): Promise<Customer[]> {
    const { data } = await api.get("/customers", { params: filters });
    return data;
  },

  async getById(id: string): Promise<Customer> {
    const { data } = await api.get(`/customers/${id}`);
    return data;
  },

  async create(input: CreateCustomerInput): Promise<string> {
    const { data } = await api.post("/customers", input);
    return data.id;
  },

  async update(id: string, input: UpdateCustomerInput): Promise<void> {
    await api.patch(`/customers/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
