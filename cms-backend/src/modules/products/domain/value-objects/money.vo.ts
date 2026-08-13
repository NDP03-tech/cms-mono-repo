export class Money {
  private constructor(
    private readonly currency: string,
    private readonly amount: number,
  ) {}
  static create(amount: number | string, currency: string): Money {
    const finalCurrency = currency.toUpperCase().trim();
    const finalAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount;

    if (Number.isNaN(finalAmount)) {
      throw new Error('So tien khong hop le');
    }
    if (finalAmount < 0) {
      throw new Error('Khong the de so tien la gia tri am o day');
    }
    return new Money(finalCurrency, finalAmount);
  }

  add(other: Money): Money {
    if (other.currency !== this.currency)
      throw new Error('Phai co cung don vi tien te');
    const newAmount = this.amount + other.amount;
    return new Money(this.currency, newAmount);
  }

  get amountValue(): number {
    return this.amount;
  }

  get currencyValue(): string {
    return this.currency;
  }
}
