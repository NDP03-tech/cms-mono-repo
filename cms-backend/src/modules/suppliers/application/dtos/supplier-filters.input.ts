// application/dto/supplier-filters.input.ts
export interface SupplierFiltersInput {
  name?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
