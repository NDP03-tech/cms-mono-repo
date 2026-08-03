export class Address {
  private constructor(private readonly value: string) {}
  static create(value: string): Address {
    const trimmed = value.trim();
    if (!trimmed) throw new Error('Address cannot be empty');
    return new Address(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
