// domain/repositories/inventory-balance.repository.interface.ts
import { InventoryBalance } from '../entities/inventory-balance.entity';

export const INVENTORY_BALANCE_REPOSITORY = 'INVENTORY_BALANCE_REPOSITORY';

export interface InventoryBalanceFilters {
  productId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  page?: number;
  limit?: number;
}

export interface IInventoryBalanceRepository {
  findByProductId(productId: string): Promise<InventoryBalance | null>;
  findAll(filters?: InventoryBalanceFilters): Promise<InventoryBalance[]>;
  findLowStock(threshold: number): Promise<InventoryBalance[]>;
  save(balance: InventoryBalance): Promise<void>;
}
