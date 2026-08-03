export class SKU {
  private constructor(public readonly value: string) {}
  static create(raw: string): SKU {
    const trimmed = raw.trim().toUpperCase();
    if (!trimmed || trimmed.length > 5) throw new Error(`Van la raw :${raw}`);
    return new SKU(trimmed);
  }

  get skuValue() {
    return this.value;
  }
  equals(other: SKU): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
