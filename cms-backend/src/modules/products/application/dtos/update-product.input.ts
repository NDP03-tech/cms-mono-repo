// application/dto/update-product.input.ts
export interface UpdateProductInput {
  name?: string;
  costPrice?: number;
  currency?: string;
  unit?: string;
  isActive?: boolean;
}
