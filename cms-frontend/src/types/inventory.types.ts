
export type InventoryTransactionType = "stock-in" | "stock-out" | "adjustment";

export interface InventoryBalance {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productUnit: string;
  quantity: number;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: InventoryTransactionType;
  quantity: number;
  referenceId: string;
  referenceType: string;
  createdAt: string;
}

export interface InventoryBalanceFilters {
  productId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  page?: number;
  limit?: number;
}

export interface InventoryTransactionFilters {
  productId?: string;
  type?: InventoryTransactionType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface AdjustInventoryInput {
  productId: string;
  newQuantity: number;
  reason: string;
}
