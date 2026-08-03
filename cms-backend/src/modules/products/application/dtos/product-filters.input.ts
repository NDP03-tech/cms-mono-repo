export interface ProductFiltersInput {
  name?: string;
  sku?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  unit?: string;
  page?: number;
  limit?: number;
}
