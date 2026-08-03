// domain/entities/customer.entity.ts
import { randomUUID } from 'crypto';
import { Phone } from '../../../suppliers/domain/value-objects/phone.vo';
import { Email } from '../value-object/email.vo';

export interface CreateCustomerProps {
  name: string;
  phone?: string;
  email?: string;
}

export interface CustomerProps {
  id: string;
  name: string;
  phone?: Phone;
  email?: Email;
  isActive: boolean;
}

export class Customer {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _phone: Phone | undefined,
    private _email: Email | undefined,
    private _isActive: boolean,
  ) {}

  // ----------------------------------------------------------------
  // Factory methods
  // ----------------------------------------------------------------

  static create(props: CreateCustomerProps): Customer {
    return new Customer(
      randomUUID(),
      props.name.trim(),
      props.phone ? Phone.create(props.phone) : undefined,
      props.email ? Email.create(props.email) : undefined,
      true,
    );
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(
      props.id,
      props.name,
      props.phone,
      props.email,
      props.isActive,
    );
  }

  // ----------------------------------------------------------------
  // Business methods
  // ----------------------------------------------------------------

  updateName(name: string): void {
    const trimmed = name?.trim();
    if (!trimmed) throw new Error('Customer name cannot be empty');
    this._name = trimmed;
  }

  updatePhone(phone: string | undefined): void {
    this._phone = phone ? Phone.create(phone) : undefined;
  }

  updateEmail(email: string | undefined): void {
    this._email = email ? Email.create(email) : undefined;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    if (!this._isActive) throw new Error('Customer is already inactive');
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
  get email(): Email | undefined {
    return this._email;
  }
  get isActive(): boolean {
    return this._isActive;
  }
}
