export class StockInCode {
  private constructor(private readonly _value: string) {}

  static generate(): StockInCode {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return new StockInCode(`PN-${date}-${random}`);
  }

  static reconstitute(value: string): StockInCode {
    return new StockInCode(value);
  }

  toString(): string {
    return this._value;
  }
}
