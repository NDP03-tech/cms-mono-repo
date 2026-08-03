// application/use-cases/list-inventory-transactions.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IInventoryTransactionRepository,
  INVENTORY_TRANSACTION_REPOSITORY,
} from '../../domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionFiltersInput } from '../dto/inventory-transaction-filters.input';
import { InventoryTransactionOutput } from '../dto/inventory-transaction.output';

@Injectable()
export class ListInventoryTransactionsUseCase {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly transactionRepo: IInventoryTransactionRepository,
  ) {}

  async execute(
    filters?: InventoryTransactionFiltersInput,
  ): Promise<InventoryTransactionOutput[]> {
    const transactions = await this.transactionRepo.findAll(filters);
    return transactions.map(InventoryTransactionOutput.from);
  }
}
