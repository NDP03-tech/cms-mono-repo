// application/use-cases/record-stock-in.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { StockIn } from '../../../stock-in/domain/entities/stock-in.entity';
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
import { InventoryBalance } from '../../domain/entities/inventory-balance.entity';

@Injectable()
export class RecordStockInUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly transactionRepo: IInventoryTransactionRepository,
  ) {}

  async execute(stockIn: StockIn): Promise<void> {
    for (const item of stockIn.items) {
      // 1. upsert balance
      let balance = await this.balanceRepo.findByProductId(item.productId);
      if (!balance) {
        balance = InventoryBalance.create(item.productId);
      }
      balance.increase(item.quantity);
      await this.balanceRepo.save(balance);

      // 2. ghi transaction
      const transaction = InventoryTransaction.create({
        productId: item.productId,
        type: InventoryTransactionType.STOCK_IN,
        quantity: item.quantity,
        referenceId: stockIn.id,
        referenceType: 'stock_in',
      });
      await this.transactionRepo.save(transaction);
    }
  }
}
