// application/dto/inventory-balance.output.ts
import { InventoryBalance } from '../../domain/entities/inventory-balance.entity';

export class InventoryBalanceOutput {
  id: string;
  productId: string;
  quantity: number;
  updatedAt: Date;

  static from(balance: InventoryBalance): InventoryBalanceOutput {
    const output = new InventoryBalanceOutput();
    output.id = balance.id;
    output.productId = balance.productId;
    output.quantity = balance.quantity;
    output.updatedAt = balance.updatedAt;
    return output;
  }
}
