// src/types/product.types.ts
export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  costPrice: number;
  currency: string;
  isActive: boolean;
}

export interface ProductFilters {
  name?: string;
  sku?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  unit?: string;
  costPrice: number;
  currency: string;
}

export interface UpdateProductInput {
  name?: string;
  unit?: string;
  costPrice?: number;
  currency?: string;
  isActive?: boolean;
}
