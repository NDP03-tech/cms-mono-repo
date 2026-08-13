// src/types/stock-in.types.ts

export type StockInStatus = "draft" | "pending" | "approved" | "rejected";

export interface StockInItem {
  id: string;
  stockInId: string;

  productId: string;
  productName: string;
  productSku: string;

  quantity: number;

  unitPrice: number;
  totalPrice: number;

  currency: string;
}

// src/types/stock-in.types.ts — thêm field còn thiếu
export interface StockIn {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  createdBy: string;
  createdByName?: string; // thêm — optional vì BE có thể không trả
  status: StockInStatus;
  totalAmount: number;
  currency: string;
  items: StockInItem[];
  approvedAt?: string;
  createdAt: string;
}

export interface StockInItemDraft {
  tempId: string;

  productId: string;
  productName: string;
  productSku: string;

  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface CreateStockInInput {
  supplierId: string;
  currency: string;
  items?: {
    productId: string;
    quantity: number;
    unitPrice: number;
    currency: string;
  }[];
}

export interface CreateStockInItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface UpdateStockInItemInput {
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface StockInFilters {
  status?: StockInStatus;
  supplierId?: string;
}
