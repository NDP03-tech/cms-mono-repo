// application/use-cases/record-stock-out.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { StockOut } from '../../../stock-out/domain/entities/stock-out.entity';
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

@Injectable()
export class RecordStockOutUseCase {
  constructor(
    @Inject(INVENTORY_BALANCE_REPOSITORY)
    private readonly balanceRepo: IInventoryBalanceRepository,
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly transactionRepo: IInventoryTransactionRepository,
  ) {}

  async execute(stockOut: StockOut): Promise<void> {
    for (const item of stockOut.items) {
      // 1. check + decrease balance
      const balance = await this.balanceRepo.findByProductId(item.productId);
      if (!balance) {
        throw new Error(
          `No inventory balance found for product ${item.productId}`,
        );
      }
      balance.decrease(item.quantity); // throws nếu không đủ tồn kho
      await this.balanceRepo.save(balance);

      // 2. ghi transaction
      const transaction = InventoryTransaction.create({
        productId: item.productId,
        type: InventoryTransactionType.STOCK_OUT,
        quantity: item.quantity,
        referenceId: stockOut.id,
        referenceType: 'stock_out',
      });
      await this.transactionRepo.save(transaction);
    }
  }
}
