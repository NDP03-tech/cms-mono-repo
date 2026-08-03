export class Email {
  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new Error(`Invalid email: ${value}`);
    }
    return new Email(trimmed);
  }

  toString(): string {
    return this._value;
  }
}
