// src/types/supplier.types.ts
export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  isActive: boolean;
  code?: string;
}

export interface SupplierFilters {
  search?: string;
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  code?: string;
}

export interface CreateSupplierInput {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  code?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  code?: string;
  isActive?: boolean;
}
