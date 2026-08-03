// application/dto/adjust-inventory.input.ts
export interface AdjustInventoryInput {
  productId: string;
  newQuantity: number;
  reason: string;
}
