// src/types/customer.types.ts

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
}

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

export interface CustomerFilters {
  name?: string;
  email?: string;
  isActive?: boolean;
  page?: number;
  address?:string;
  limit?: number;
}
