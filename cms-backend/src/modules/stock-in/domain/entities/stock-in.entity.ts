// domain/entities/stock-in.entity.ts
import { randomUUID } from 'crypto';
import { Money } from '../../../products/domain/value-objects/money.vo';
import { StockInCode } from '../value-objects/stock-in-code.vo';
import { StockInStatus } from '../enums/stock-in-status.enum';
import { StockInItem, CreateStockInItemProps } from './stock-in-item.entity';

export interface CreateStockInProps {
  supplierId: string;
  createdBy: string;
  currency: string;
}

export interface StockInProps {
  id: string;
  code: StockInCode;
  supplierId: string;
  createdBy: string;
  status: StockInStatus;
  totalAmount: Money;
  items: StockInItem[];
  approvedAt?: Date;
  createdAt: Date;
}

export class StockIn {
  private constructor(
    private readonly _id: string,
    private readonly _code: StockInCode,
    private readonly _supplierId: string,
    private readonly _createdBy: string,
    private _status: StockInStatus,
    private _totalAmount: Money,
    private _items: StockInItem[],
    private _approvedAt: Date | undefined,
    private readonly _createdAt: Date,
  ) {}

  // ----------------------------------------------------------------
  // Factory methods
  // ----------------------------------------------------------------

  static create(props: CreateStockInProps): StockIn {
    return new StockIn(
      randomUUID(),
      StockInCode.generate(),
      props.supplierId,
      props.createdBy,
      StockInStatus.DRAFT,
      Money.create(0, props.currency),
      [],
      undefined,
      new Date(),
    );
  }

  static reconstitute(props: StockInProps): StockIn {
    return new StockIn(
      props.id,
      props.code,
      props.supplierId,
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
    if (this._status !== StockInStatus.DRAFT) {
      throw new Error('Only draft stock-in can be submitted');
    }
    if (this._items.length === 0) {
      throw new Error('Cannot submit stock-in without items');
    }
    this._status = StockInStatus.PENDING;
  }

  approve(): void {
    if (this._status !== StockInStatus.PENDING) {
      throw new Error('Only pending stock-in can be approved');
    }
    this._status = StockInStatus.APPROVED;
    this._approvedAt = new Date();
  }

  reject(): void {
    if (this._status !== StockInStatus.PENDING) {
      throw new Error('Only pending stock-in can be rejected');
    }
    this._status = StockInStatus.REJECTED;
  }

  // ----------------------------------------------------------------
  // Item management — chỉ cho phép khi status là DRAFT
  // ----------------------------------------------------------------

  addItem(props: CreateStockInItemProps): void {
    this.guardDraft();

    const exists = this._items.find((i) => i.productId === props.productId);
    if (exists) throw new Error(`Product ${props.productId} da ton tai`);

    const item = StockInItem.create(this._id, props);
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
    if (this._status !== StockInStatus.DRAFT) {
      throw new Error('Items chi co the sua khi dang o trang thai DRAFT');
    }
  }

  private findItemOrThrow(itemId: string): StockInItem {
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
  get code(): StockInCode {
    return this._code;
  }
  get supplierId(): string {
    return this._supplierId;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get status(): StockInStatus {
    return this._status;
  }
  get totalAmount(): Money {
    return this._totalAmount;
  }
  get items(): StockInItem[] {
    return [...this._items];
  }
  get approvedAt(): Date | undefined {
    return this._approvedAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
