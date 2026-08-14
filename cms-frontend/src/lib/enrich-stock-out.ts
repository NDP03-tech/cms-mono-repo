// src/lib/enrich-stock-out.ts
//
// BE (StockOutOutput/StockOutItemOutput) đã enrich customerName nhưng CHƯA
// enrich productName/productSku trên từng item. Các hàm dưới đây join dữ
// liệu ở phía FE bằng danh sách customer/product đã fetch sẵn, dùng như
// fallback (nếu BE trả customerName thì giữ nguyên) hoặc để bù trực tiếp
// cho productName còn thiếu.

import { StockOut, StockOutItem } from "@/types/stock-out.types";
import { Customer } from "@/types/customer.types";
import { Product } from "@/types/product.types";

export function withCustomerNames(
  stockOuts: StockOut[],
  customers: Customer[],
): StockOut[] {
  const nameById = new Map(customers.map((c) => [c.id, c.name]));

  return stockOuts.map((stockOut) => ({
    ...stockOut,
    customerName: stockOut.customerName ?? nameById.get(stockOut.customerId),
  }));
}

export function withProductNames(
  items: StockOutItem[],
  products: Product[],
): StockOutItem[] {
  const productById = new Map(products.map((p) => [p.id, p]));

  return items.map((item) => {
    const product = productById.get(item.productId);
    return {
      ...item,
      productName: item.productName ?? product?.name ?? item.productId,
      productSku: item.productSku ?? product?.sku,
    };
  });
}

/** Enrich cả customerName lẫn productName của từng item trong 1 stockOut. */
export function enrichStockOut(
  stockOut: StockOut,
  customers: Customer[],
  products: Product[],
): StockOut {
  const [enriched] = withCustomerNames([stockOut], customers);
  return {
    ...enriched,
    items: withProductNames(enriched.items, products),
  };
}
