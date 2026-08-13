// src/types/stock-out.types.ts

// Đã xác nhận: StockOutEnum ở BE là chữ thường.
export type StockOutStatus = "draft" | "pending" | "approved" | "rejected";

export interface StockOutItem {
  id: string;
  productId: string;
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

  // KHÔNG có trong StockOutOutput trả về từ BE — đây là field FE tự gắn thêm
  // sau khi fetch (xem lib/enrich-stock-out.ts). Luôn optional, đừng đọc trực
  // tiếp field này ngay sau stockOutService.list()/getById() mà chưa enrich.
  customerName?: string;
  createdByName?: string;
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
