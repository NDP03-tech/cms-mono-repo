// src/types/stock-in.types.ts
export type StockInStatus = "draft" | "pending" | "approved" | "rejected";

export interface StockInItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  totalPrice: number;
}

export interface StockIn {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  createdBy: string;
  status: StockInStatus;
  totalAmount: number;
  currency: string;
  items: StockInItem[];
  approvedAt?: string;
  createdAt: string;
}

export interface StockInFilters {
  code?: string;
  supplierId?: string;
  status?: StockInStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

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
