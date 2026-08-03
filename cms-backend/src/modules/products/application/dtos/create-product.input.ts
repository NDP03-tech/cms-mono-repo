// application/dto/create-product.input.ts
export interface CreateProductInput {
  sku: string;
  name: string;
  costPrice: number;
  currency: string;
  unit?: string;
}
