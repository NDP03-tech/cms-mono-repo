// domain/repositories/inventory-transaction.repository.interface.ts
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { InventoryTransactionType } from '../enums/inventory-transaction-type.enum';

export const INVENTORY_TRANSACTION_REPOSITORY =
  'INVENTORY_TRANSACTION_REPOSITORY';

export interface InventoryTransactionFilters {
  productId?: string;
  type?: InventoryTransactionType;
  referenceId?: string;
  referenceType?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IInventoryTransactionRepository {
  findById(id: string): Promise<InventoryTransaction | null>;
  findAll(
    filters?: InventoryTransactionFilters,
  ): Promise<InventoryTransaction[]>;
  save(transaction: InventoryTransaction): Promise<void>;
}
