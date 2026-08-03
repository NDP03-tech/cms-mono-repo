// domain/value-objects/product-id.vo.ts
import { randomUUID } from 'crypto';

export class ProductId {
  private constructor(private readonly value: string) {}

  static generate(): string {
    return randomUUID();
  }

  static from(value: string): string {
    if (!value?.trim()) throw new Error('ProductId cannot be empty');
    return value;
  }
}
