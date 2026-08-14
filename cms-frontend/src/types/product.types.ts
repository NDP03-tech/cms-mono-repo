// src/types/product.types.ts
//
// Khớp với ProductOutput thật từ BE (application/dto/product.output.ts).
export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  costPrice: number;
  currency: string;
  isActive: boolean;
}

// Khớp CreateProductProps / create-product.use-case.ts
export interface CreateProductInput {
  sku: string;
  name: string;
  costPrice: number;
  currency: string;
  unit?: string;
}

// Khớp update-product.use-case.ts
export interface UpdateProductInput {
  name?: string;
  unit?: string;
  costPrice?: number;
  currency?: string;
  isActive?: boolean;
}

// GIẢ ĐỊNH — chưa thấy product-filters.input.ts thật, đổi lại nếu khác.
export interface ProductFilters {
  name?: string;
  sku?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
