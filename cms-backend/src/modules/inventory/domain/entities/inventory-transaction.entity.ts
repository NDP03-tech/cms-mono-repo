// domain/entities/inventory-transaction.entity.ts
import { randomUUID } from 'crypto';
import { InventoryTransactionType } from '../enums/inventory-transaction-type.enum';

export interface CreateInventoryTransactionProps {
  productId: string;
  type: InventoryTransactionType;
  quantity: number; // luôn dương — direction xác định bằng type
  referenceId: string;
  referenceType: string;
}

export interface InventoryTransactionProps {
  id: string;
  productId: string;
  type: InventoryTransactionType;
  quantity: number;
  referenceId: string;
  referenceType: string;
  createdAt: Date;
}

export class InventoryTransaction {
  private constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private readonly _type: InventoryTransactionType,
    private readonly _quantity: number,
    private readonly _referenceId: string,
    private readonly _referenceType: string,
    private readonly _createdAt: Date,
  ) {}

  static create(props: CreateInventoryTransactionProps): InventoryTransaction {
    if (props.quantity <= 0) throw new Error('Quantity must be greater than 0');
    return new InventoryTransaction(
      randomUUID(),
      props.productId,
      props.type,
      props.quantity,
      props.referenceId,
      props.referenceType,
      new Date(),
    );
  }

  static reconstitute(props: InventoryTransactionProps): InventoryTransaction {
    return new InventoryTransaction(
      props.id,
      props.productId,
      props.type,
      props.quantity,
      props.referenceId,
      props.referenceType,
      props.createdAt,
    );
  }

  get id(): string {
    return this._id;
  }
  get productId(): string {
    return this._productId;
  }
  get type(): InventoryTransactionType {
    return this._type;
  }
  get quantity(): number {
    return this._quantity;
  }
  get referenceId(): string {
    return this._referenceId;
  }
  get referenceType(): string {
    return this._referenceType;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
