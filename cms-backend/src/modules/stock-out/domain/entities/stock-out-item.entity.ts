import { randomUUID } from 'crypto';
import { Money } from '../../../products/domain/value-objects/money.vo';

export interface CreateStockOutItemProps {
  productId: string;
  quantity: number;
  unitPrice: number; // number thô, không phải Money
  currency: string;
}

export interface StockOutItemProps {
  id: string;
  stockOutId: string;
  productId: string;
  quantity: number;
  unitPrice: Money;
}

export class StockOutItem {
  private constructor(
    private readonly _id: string,
    private readonly _stockOutId: string,
    private readonly _productId: string,
    private _quantity: number,
    private _unitPrice: Money,
  ) {}

  // computed — tự tính, không lưu riêng
  get totalPrice(): Money {
    return Money.create(
      this._quantity * this._unitPrice.amountValue,
      this._unitPrice.currencyValue,
    );
  }

  static create(
    stockOutId: string,
    props: CreateStockOutItemProps,
  ): StockOutItem {
    if (props.quantity <= 0) throw new Error('Quantity must be greater than 0');
    if (props.unitPrice <= 0)
      throw new Error('Unit price must be greater than 0');

    return new StockOutItem(
      randomUUID(), // gọi hàm, có ()
      stockOutId,
      props.productId,
      props.quantity,
      Money.create(props.unitPrice, props.currency), // number -> Money
    );
  }

  static reconstitute(props: StockOutItemProps): StockOutItem {
    return new StockOutItem(
      props.id,
      props.stockOutId,
      props.productId,
      props.quantity,
      props.unitPrice,
    );
  }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0');
    this._quantity = quantity;
  }

  updateUnitPrice(unitPrice: number, currency: string): void {
    if (unitPrice <= 0) throw new Error('Unit price must be greater than 0');
    this._unitPrice = Money.create(unitPrice, currency);
  }

  get id(): string {
    return this._id;
  }
  get stockOutId(): string {
    return this._stockOutId;
  }
  get productId(): string {
    return this._productId;
  }
  get quantity(): number {
    return this._quantity;
  }
  get unitPrice(): Money {
    return this._unitPrice;
  }
}
