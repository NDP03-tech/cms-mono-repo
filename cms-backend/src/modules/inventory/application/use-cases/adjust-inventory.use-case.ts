// application/use-cases/adjust-inventory.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { InventoryBalance } from '../../domain/entities/inventory-balance.entity';
import { InventoryTransaction } from '../../domain/entities/inventory-transaction.entity';
import { InventoryTransactionType } from '../../domain/enums/inventory-transaction-type.enum';
import {
  type IInventoryBalanceRepository,
  INVENTORY_BALANCE_REPOSITORY,
} from '../../domain/repositories/inventory-balance.repository.interface';
import {
  type IInventoryTransactionRepository,
  INVENTORY_TRANSACTION_REPOSITORY,
} from '../../domain/repositories/inventory-transaction.repository.interface';
import { AdjustInventoryInput } from '../dto/adjust-inventory.input';

@Injectable()
export class AdjustInventoryUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly transactionRepo: IInventoryTransactionRepository,
  ) {}

  async execute(input: AdjustInventoryInput): Promise<void> {
    // 1. upsert balance
    let balance = await this.balanceRepo.findByProductId(input.productId);
    if (!balance) {
      balance = InventoryBalance.create(input.productId);
    }

    const diff = Math.abs(input.newQuantity - balance.quantity);
    balance.adjust(input.newQuantity);
    await this.balanceRepo.save(balance);

    // 2. ghi transaction nếu có thay đổi
    if (diff > 0) {
      const transaction = InventoryTransaction.create({
        productId: input.productId,
        type: InventoryTransactionType.ADJUSTMENT,
        quantity: diff,
        referenceId: input.productId,
        referenceType: 'adjustment',
      });
      await this.transactionRepo.save(transaction);
    }
  }
}
