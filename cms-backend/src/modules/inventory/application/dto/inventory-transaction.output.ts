// application/dto/inventory-transaction.output.ts
import { InventoryTransaction } from '../../domain/entities/inventory-transaction.entity';
import { InventoryTransactionType } from '../../domain/enums/inventory-transaction-type.enum';

// Sản phẩm có thể trả sku dạng value object (SKU.value) — dùng chung logic
// với inventory-balance.output.ts để không lặp code khác kiểu ở 2 nơi.
type Stringish = string | { value: string } | { toString(): string };

interface ProductInfo {
  name: string;
  sku: Stringish;
}

function toPlainString(input: Stringish | undefined): string {
  if (input === undefined || input === null) return '';
  if (typeof input === 'string') return input;
  if ('value' in input && typeof input.value === 'string') return input.value;
  return String(input);
}

export class InventoryTransactionOutput {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: InventoryTransactionType;
  quantity: number;
  referenceId: string;
  referenceType: string;
  createdAt: Date;

  static from(
    transaction: InventoryTransaction,
    product?: ProductInfo,
  ): InventoryTransactionOutput {
    const output = new InventoryTransactionOutput();
    output.id = transaction.id;
    output.productId = transaction.productId;
    output.productName = product?.name ?? '';
    output.productSku = toPlainString(product?.sku);
    output.type = transaction.type;
    output.quantity = transaction.quantity;
    output.referenceId = transaction.referenceId;
    output.referenceType = transaction.referenceType;
    output.createdAt = transaction.createdAt;
    return output;
  }
}
