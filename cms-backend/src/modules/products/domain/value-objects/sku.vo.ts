export class SKU {
  private constructor(public readonly value: string) {}

  static create(raw: string): SKU {
    if (!raw?.trim()) throw new Error('SKU không được để trống');

    const trimmed = raw.trim().toUpperCase();

    if (trimmed.length < 2) {
      throw new Error('SKU phải có ít nhất 2 ký tự');
    }

    if (trimmed.length > 50) {
      throw new Error('SKU không được vượt quá 50 ký tự');
    }

    // Chỉ cho phép chữ cái, số và dấu gạch ngang
    if (!/^[A-Z0-9-_]+$/.test(trimmed)) {
      throw new Error('SKU chỉ được chứa chữ cái, số, dấu - và _');
    }

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
