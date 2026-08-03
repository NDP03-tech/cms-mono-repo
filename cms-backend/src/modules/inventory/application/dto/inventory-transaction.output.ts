// application/dto/inventory-transaction.output.ts
import { InventoryTransaction } from '../../domain/entities/inventory-transaction.entity';
import { InventoryTransactionType } from '../../domain/enums/inventory-transaction-type.enum';

export class InventoryTransactionOutput {
  id: string;
  productId: string;
  type: InventoryTransactionType;
  quantity: number;
  referenceId: string;
  referenceType: string;
  createdAt: Date;

  static from(transaction: InventoryTransaction): InventoryTransactionOutput {
    const output = new InventoryTransactionOutput();
    output.id = transaction.id;
    output.productId = transaction.productId;
    output.type = transaction.type;
    output.quantity = transaction.quantity;
    output.referenceId = transaction.referenceId;
    output.referenceType = transaction.referenceType;
    output.createdAt = transaction.createdAt;
    return output;
  }
}
