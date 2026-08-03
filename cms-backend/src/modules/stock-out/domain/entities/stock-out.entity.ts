// domain/entities/stock-out.entity.ts
import { randomUUID } from 'crypto';
import { Money } from '../../../products/domain/value-objects/money.vo';
import { StockOutCode } from '../value-objects/stock-out-code.vo';
import { StockOutEnum } from '../enums/stock-out-status.enum';
import { StockOutItem, CreateStockOutItemProps } from './stock-out-item.entity';

export interface CreateStockOutProps {
  customerId: string;
  createdBy: string;
  currency: string;
}

export interface StockOutProps {
  id: string;
  code: StockOutCode;
  customerId: string;
  createdBy: string;
  status: StockOutEnum;
  totalAmount: Money;
  items: StockOutItem[];
  approvedAt?: Date;
  createdAt: Date;
}

export class StockOut {
  private constructor(
    private readonly _id: string,
    private readonly _code: StockOutCode,
    private readonly _customerId: string,
    private readonly _createdBy: string,
    private _status: StockOutEnum,
    private _totalAmount: Money,
    private _items: StockOutItem[],
    private _approvedAt: Date | undefined,
    private readonly _createdAt: Date,
  ) {}

  // ----------------------------------------------------------------
  // Factory methods
  // ----------------------------------------------------------------

  static create(props: CreateStockOutProps): StockOut {
    return new StockOut(
      randomUUID(),
      StockOutCode.generate(),
      props.customerId,
      props.createdBy,
      StockOutEnum.DRAFT,
      Money.create(0, props.currency),
      [],
      undefined,
      new Date(),
    );
  }

  static reconstitute(props: StockOutProps): StockOut {
    return new StockOut(
      props.id,
      props.code,
      props.customerId,
      props.createdBy,
      props.status,
      props.totalAmount,
      props.items,
      props.approvedAt,
      props.createdAt,
    );
  }

  // ----------------------------------------------------------------
  // Status transitions
  // ----------------------------------------------------------------

  submit(): void {
    if (this._status !== StockOutEnum.DRAFT) {
      throw new Error('Only draft stock-out can be submitted');
    }
    if (this._items.length === 0) {
      throw new Error('Cannot submit stock-out without items');
    }
    this._status = StockOutEnum.PENDING;
  }

  approve(): void {
    if (this._status !== StockOutEnum.PENDING) {
      throw new Error('Only pending stock-out can be approved');
    }
    this._status = StockOutEnum.APPROVED;
    this._approvedAt = new Date();
  }

  reject(): void {
    if (this._status !== StockOutEnum.PENDING) {
      throw new Error('Only pending stock-out can be rejected');
    }
    this._status = StockOutEnum.REJECTED;
  }

  // ----------------------------------------------------------------
  // Item management — chỉ cho phép khi status là DRAFT
  // ----------------------------------------------------------------

  addItem(props: CreateStockOutItemProps): void {
    this.guardDraft();

    const exists = this._items.find((i) => i.productId === props.productId);
    if (exists)
      throw new Error(
        `Product ${props.productId} already exists in this stock-out`,
      );

    const item = StockOutItem.create(this._id, props);
    this._items.push(item);
    this.recalculateTotal();
  }

  updateItem(
    itemId: string,
    quantity: number,
    unitPrice: number,
    currency: string,
  ): void {
    this.guardDraft();

    const item = this.findItemOrThrow(itemId);
    item.updateQuantity(quantity);
    item.updateUnitPrice(unitPrice, currency);
    this.recalculateTotal();
  }

  removeItem(itemId: string): void {
    this.guardDraft();

    const index = this._items.findIndex((i) => i.id === itemId);
    if (index === -1) throw new Error(`Item ${itemId} not found`);

    this._items.splice(index, 1);
    this.recalculateTotal();
  }

  // ----------------------------------------------------------------
  // Private helpers
  // ----------------------------------------------------------------

  private guardDraft(): void {
    if (this._status !== StockOutEnum.DRAFT) {
      throw new Error(
        'Items can only be modified when stock-out is in draft status',
      );
    }
  }

  private findItemOrThrow(itemId: string): StockOutItem {
    const item = this._items.find((i) => i.id === itemId);
    if (!item) throw new Error(`Item ${itemId} not found`);
    return item;
  }

  private recalculateTotal(): void {
    const total = this._items.reduce(
      (sum, item) => sum + item.totalPrice.amountValue,
      0,
    );
    this._totalAmount = Money.create(total, this._totalAmount.currencyValue);
  }

  // ----------------------------------------------------------------
  // Getters
  // ----------------------------------------------------------------

  get id(): string {
    return this._id;
  }
  get code(): StockOutCode {
    return this._code;
  }
  get customerId(): string {
    return this._customerId;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get status(): StockOutEnum {
    return this._status;
  }
  get totalAmount(): Money {
    return this._totalAmount;
  }
  get items(): StockOutItem[] {
    return [...this._items];
  }
  get approvedAt(): Date | undefined {
    return this._approvedAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
