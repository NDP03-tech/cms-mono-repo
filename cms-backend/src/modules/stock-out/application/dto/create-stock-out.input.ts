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
  // Người trực tiếp nhận hàng — có thể khác thông tin khách hàng gốc
  recipientName?: string;
  recipientPhone?: string;
  note?: string;
}
