export class Phone {
  private constructor(private readonly value: string) {}
  static create(value: string): Phone {
    const trimmed = value.trim().replace(/\s+/g, '');
    if (!/^[+]?[\d]{9,15}$/.test(trimmed)) {
      throw new Error(`Invalid phone number: ${value}`);
    }
    return new Phone(trimmed);
  }
  toString(): string {
    return this.value;
  }
}
