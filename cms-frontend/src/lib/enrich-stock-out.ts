// src/lib/enrich-stock-out.ts
//
// BE trả StockOutOutput chỉ có customerId/createdBy (id thuần), không kèm tên.
// 2 hàm này gắn thêm customerName ở phía FE bằng cách join với danh sách
// Customer đã fetch riêng (qua customerService). Nếu sau này BE enrich sẵn
// tên trong response, có thể bỏ bước gọi 2 hàm này đi.
import type { Customer } from "@/types/customer.types";
import type { StockOut } from "@/types/stock-out.types";

export function withCustomerNames<T extends StockOut>(
  stockOuts: T[],
  customers: Customer[],
): T[] {
  const nameById = new Map(customers.map((c) => [c.id, c.name]));
  return stockOuts.map((s) => ({
    ...s,
    customerName: s.customerName ?? nameById.get(s.customerId) ?? s.customerId,
  }));
}

export function withCustomerName<T extends StockOut>(
  stockOut: T,
  customers: Customer[],
): T {
  const nameById = new Map(customers.map((c) => [c.id, c.name]));
  return {
    ...stockOut,
    customerName:
      stockOut.customerName ??
      nameById.get(stockOut.customerId) ??
      stockOut.customerId,
  };
}
