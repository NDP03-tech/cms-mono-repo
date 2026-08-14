// src/types/stock-out.types.ts

export type StockOutStatus = "draft" | "pending" | "approved" | "rejected";

export interface StockOutItem {
  id: string;
  productId: string;
  // BE (StockOutItemOutput) chưa enrich 2 field này — FE tự join bằng
  // src/lib/enrich-stock-out.ts (withProductNames) cho tới khi BE làm
  // enrichment tương tự customerName.
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export interface StockOut {
  id: string;
  code: string;
  customerId: string;
  createdBy: string;
  status: StockOutStatus;
  totalAmount: number;
  currency: string;
  items: StockOutItem[];
  approvedAt?: string;
  createdAt: string;
  customerName?: string;
  createdByName?: string;
  recipientName?: string;
  recipientPhone?: string;
  note?: string;
}

export interface CreateStockOutItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface CreateStockOutInput {
  customerId: string;
  // BE ghi đè bằng user JWT (StockOutController#create) nên FE không bắt buộc gửi.
  createdBy?: string;
  currency: string;
  items: CreateStockOutItemInput[];
  // Người trực tiếp nhận hàng — có thể khác khách hàng đã đăng ký.
  recipientName?: string;
  recipientPhone?: string;
  note?: string;
}

export interface UpdateStockOutItemInput {
  itemId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface StockOutFilters {
  code?: string;
  customerId?: string;
  createdBy?: string;
  status?: StockOutStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

/** Item nháp khi đang dựng phiếu ở trang /stock-out/new — chưa persist lên BE. */
export interface StockOutItemDraft {
  tempId: string;
  productId: string;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}
