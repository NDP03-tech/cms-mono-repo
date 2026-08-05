// src/types/customer.types.ts
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface CustomerFilters {
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateCustomerInput {
  name: string;
  phone?: string;
  email?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}