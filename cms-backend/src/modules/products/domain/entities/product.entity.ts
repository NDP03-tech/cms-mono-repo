import { randomUUID } from 'crypto';
import { Money } from '../value-objects/money.vo';
import { SKU } from '../value-objects/sku.vo';

export interface CreateProductProps {
  sku: string;
  name: string;
  costPrice: number;
  currency: string;
  unit?: string;
}

export interface ProductProps {
  id: string;
  sku: SKU;
  name: string;
  unit: string;
  costPrice: Money;
  isActive: boolean;
}

export class Product {
  private constructor(
    private readonly _id: string,
    private _sku: SKU,
    private _name: string,
    private _unit: string,
    private _costPrice: Money,
    private _isActive: boolean,
  ) {}

  // ----------------------------------------------------------------
  // Factory methods
  // ----------------------------------------------------------------

  static create(props: CreateProductProps): Product {
    return new Product(
      randomUUID(),
      SKU.create(props.sku),
      props.name.trim(),
      props.unit?.trim() ?? '',
      Money.create(props.costPrice, props.currency),
      true,
    );
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(
      props.id,
      props.sku,
      props.name,
      props.unit,
      props.costPrice,
      props.isActive,
    );
  }

  // ----------------------------------------------------------------
  // Business methods
  // ----------------------------------------------------------------

  updateName(name: string): void {
    const trimmed = name?.trim();
    if (!trimmed) throw new Error('Product name cannot be empty');
    this._name = trimmed;
  }

  updateSku(sku: string): void {
    this._sku = SKU.create(sku);
  }

  updatePrice(costPrice: number, currency: string): void {
    this._costPrice = Money.create(costPrice, currency);
  }

  updateUnit(unit: string): void {
    this._unit = unit?.trim() ?? '';
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    if (!this._isActive) throw new Error('Product is already inactive');
    this._isActive = false;
  }

  // ----------------------------------------------------------------
  // Getters
  // ----------------------------------------------------------------

  get id(): string {
    return this._id;
  }

  get sku(): SKU {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get unit(): string {
    return this._unit;
  }

  get costPrice(): Money {
    return this._costPrice;
  }

  get isActive(): boolean {
    return this._isActive;
  }
  get skuValue(): SKU {
    return this._sku;
  }
}
