// domain/value-objects/stock-out-code.vo.ts
export class StockOutCode {
  private constructor(private readonly _value: string) {}

  static generate(): StockOutCode {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return new StockOutCode(`PX-${date}-${random}`);
  }

  static reconstitute(value: string): StockOutCode {
    return new StockOutCode(value);
  }

  toString(): string {
    return this._value;
  }
}
