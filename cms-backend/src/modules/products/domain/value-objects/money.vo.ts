export class Money {
  private constructor(
    private readonly currency: string,
    private readonly amount: number,
  ) {}
  static create(amount: number, currency: string): Money {
    const finalCurrency = currency.toUpperCase().trim();
    if (amount < 0) throw new Error('Khong the de so tien la gia tri am o day');
    return new Money(finalCurrency, amount);
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
