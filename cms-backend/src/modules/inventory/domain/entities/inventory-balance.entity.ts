export interface InventoryBalanceProps {
  id: string;
  productId: string;
  quantity: number;
  updatedAt: Date;
}

export class InventoryBalance {
  private constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private _quantity: number,
    private _updatedAt: Date,
  ) {}
  static create(productId: string): InventoryBalance {
    return new InventoryBalance(productId, productId, 0, new Date());
  }

  static reconstitute(props: InventoryBalanceProps): InventoryBalance {
    return new InventoryBalance(
      props.id,
      props.productId,
      props.quantity,
      props.updatedAt,
    );
  }

  increase(quantity: number): void {
    if (quantity < 0) throw new Error('Quantity must be greater than 0');
    this._quantity += quantity;
    this._updatedAt = new Date();
  }

  decrease(quantity: number): void {
    if (quantity < 0) throw new Error('Quantity must be greater than 0');
    if (this._quantity < quantity)
      throw new Error(
        `Insufficient stock for product ${this._productId}. Available: ${this._quantity}, requested: ${quantity}`,
      );
    this._quantity -= quantity;
    this._updatedAt = new Date();
  }

  adjust(newQuantity: number): void {
    if (newQuantity < 0)
      throw new Error('Quantity must be greater than or equal to 0');
    this._quantity = newQuantity;
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }
  get productId(): string {
    return this._productId;
  }
  get quantity(): number {
    return this._quantity;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
