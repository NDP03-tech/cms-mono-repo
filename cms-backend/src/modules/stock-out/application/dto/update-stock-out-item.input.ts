// application/dto/update-stock-out-item.input.ts
export interface UpdateStockOutItemInput {
  itemId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}
