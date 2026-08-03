// domain/entities/stock-in-item.entity.ts
import { randomUUID } from 'crypto';
import { Money } from '../../../products/domain/value-objects/money.vo';

export interface CreateStockInItemProps {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface StockInItemProps {
  id: string;
  stockInId: string;
  productId: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
}

export class StockInItem {
  private constructor(
    private readonly _id: string,
    private readonly _stockInId: string,
    private readonly _productId: string,
    private _quantity: number,
    private _unitPrice: Money,
    private _totalPrice: Money,
  ) {}

  static create(stockInId: string, props: CreateStockInItemProps): StockInItem {
    if (props.quantity <= 0) throw new Error('So luong phai lon hon 0');

    const unitPrice = Money.create(props.unitPrice, props.currency);
    const totalPrice = Money.create(
      props.quantity * props.unitPrice,
      props.currency,
    );

    return new StockInItem(
      randomUUID(),
      stockInId,
      props.productId,
      props.quantity,
      unitPrice,
      totalPrice,
    );
  }

  static reconstitute(props: StockInItemProps): StockInItem {
    return new StockInItem(
      props.id,
      props.stockInId,
      props.productId,
      props.quantity,
      props.unitPrice,
      props.totalPrice,
    );
  }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0');
    this._quantity = quantity;
    this._totalPrice = Money.create(
      quantity * this._unitPrice.amountValue,
      this._unitPrice.currencyValue,
    );
  }

  updateUnitPrice(unitPrice: number, currency: string): void {
    if (unitPrice <= 0) throw new Error('Unit price must be greater than 0');
    this._unitPrice = Money.create(unitPrice, currency);
    this._totalPrice = Money.create(this._quantity * unitPrice, currency);
  }

  get id(): string {
    return this._id;
  }
  get stockInId(): string {
    return this._stockInId;
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
  get totalPrice(): Money {
    return this._totalPrice;
  }
}
