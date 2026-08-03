// application/dto/inventory-transaction-filters.input.ts
import { InventoryTransactionType } from '../../domain/enums/inventory-transaction-type.enum';

export interface InventoryTransactionFiltersInput {
  productId?: string;
  type?: InventoryTransactionType;
  referenceId?: string;
  referenceType?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}
