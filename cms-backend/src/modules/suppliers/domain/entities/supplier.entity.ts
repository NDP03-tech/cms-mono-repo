// domain/entities/supplier.entity.ts
import { randomUUID } from 'crypto';
import { Phone } from '../value-objects/phone.vo';
import { Address } from '../value-objects/address.vo';

export interface CreateSupplierProps {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  isActive?: boolean;
}

export interface SupplierProps {
  id: string;
  name: string;
  phone?: Phone;
  address?: Address;
  email?: string;
  isActive: boolean;
}

export class Supplier {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _phone: Phone | undefined,
    private _address: Address | undefined,
    private _email: string | undefined,
    private _isActive: boolean,
  ) {}

  // ----------------------------------------------------------------
  // Factory methods
  // ----------------------------------------------------------------

  static create(props: CreateSupplierProps): Supplier {
    return new Supplier(
      randomUUID(),
      props.name.trim(),
      props.phone ? Phone.create(props.phone) : undefined,
      props.address ? Address.create(props.address) : undefined,
      props.email?.trim() ?? undefined,
      props.isActive ?? true,
    );
  }

  static reconstitute(props: SupplierProps): Supplier {
    return new Supplier(
      props.id,
      props.name,
      props.phone,
      props.address,
      props.email,
      props.isActive,
    );
  }

  // ----------------------------------------------------------------
  // Business methods
  // ----------------------------------------------------------------

  updateName(name: string): void {
    const trimmed = name?.trim();
    if (!trimmed) throw new Error('Supplier name cannot be empty');
    this._name = trimmed;
  }

  updatePhone(phone: string | undefined): void {
    this._phone = phone ? Phone.create(phone) : undefined;
  }

  updateAddress(address: string | undefined): void {
    this._address = address ? Address.create(address) : undefined;
  }

  updateEmail(email: string | undefined): void {
    this._email = email?.trim() ?? undefined;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    if (!this._isActive) throw new Error('Supplier is already inactive');
    this._isActive = false;
  }

  // ----------------------------------------------------------------
  // Getters
  // ----------------------------------------------------------------

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get phone(): Phone | undefined {
    return this._phone;
  }
  get address(): Address | undefined {
    return this._address;
  }
  get email(): string | undefined {
    return this._email;
  }
  get isActive(): boolean {
    return this._isActive;
  }
}
