// application/dto/update-stock-in-item.input.ts
export interface UpdateStockInItemInput {
  itemId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}
