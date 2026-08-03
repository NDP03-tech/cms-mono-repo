// application/dto/create-stock-in.input.ts
export interface CreateStockInItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface CreateStockInInput {
  supplierId: string;
  createdBy: string;
  currency: string;
  items: CreateStockInItemInput[];
}
