// src/types/stock-out.types.ts
export type StockOutStatus = "draft" | "pending" | "approved" | "rejected";

export interface StockOutItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  totalPrice: number;
}

export interface StockOut {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  createdBy: string;
  status: StockOutStatus;
  totalAmount: number;
  currency: string;
  items: StockOutItem[];
  approvedAt?: string;
  createdAt: string;
}

export interface StockOutFilters {
  code?: string;
  customerId?: string;
  status?: StockOutStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

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
