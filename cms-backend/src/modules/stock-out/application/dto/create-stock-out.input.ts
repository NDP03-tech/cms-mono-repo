// application/dto/create-stock-out.input.ts
export interface CreateStockOutItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface CreateStockOutInput {
  customerId: string;
  createdBy: string;
  currency: string;
  items: CreateStockOutItemInput[];
}
