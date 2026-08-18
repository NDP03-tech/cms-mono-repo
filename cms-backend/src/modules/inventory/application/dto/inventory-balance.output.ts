// application/dto/inventory-balance.output.ts
import { InventoryBalance } from '../../domain/entities/inventory-balance.entity';

// Product có thể trả sku/unit dạng string thuần hoặc value object (vd. SKU
// value object với property `.value` hoặc override `.toString()`). Union
// type này chấp nhận cả 2 dạng để tránh phải sửa lại DTO mỗi khi domain
// đổi cách implement value object.
type Stringish = string | { value: string } | { toString(): string };

interface ProductInfo {
  name: string;
  sku: Stringish;
  unit: Stringish;
}

/** Quy chuỗi thô ra khỏi string | { value } | { toString() }. */
function toPlainString(input: Stringish | undefined): string {
  if (input === undefined || input === null) return '';
  if (typeof input === 'string') return input;
  if ('value' in input && typeof input.value === 'string') return input.value;
  return String(input);
}

export class InventoryBalanceOutput {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productUnit: string;
  quantity: number;
  updatedAt: Date;

  static from(
    balance: InventoryBalance,
    product?: ProductInfo,
  ): InventoryBalanceOutput {
    const output = new InventoryBalanceOutput();
    output.id = balance.id;
    output.productId = balance.productId;
    output.productName = product?.name ?? '';
    output.productSku = toPlainString(product?.sku);
    output.productUnit = toPlainString(product?.unit);
    output.quantity = balance.quantity;
    output.updatedAt = balance.updatedAt;
    return output;
  }
}
