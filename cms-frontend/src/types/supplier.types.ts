// src/types/supplier.types.ts
export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  isActive: boolean;
}

export interface SupplierFilters {
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateSupplierInput {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  isActive?: boolean;
}
