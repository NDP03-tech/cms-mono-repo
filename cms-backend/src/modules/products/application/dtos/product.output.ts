// application/dto/product.output.ts
import { Product } from '../../domain/entities/product.entity';

export class ProductOutput {
  id: string;
  sku: string;
  name: string;
  unit: string;
  costPrice: number;
  currency: string;
  isActive: boolean;

  static from(product: Product): ProductOutput {
    const output = new ProductOutput();
    output.id = product.id;
    output.sku = product.sku.toString();
    output.name = product.name;
    output.unit = product.unit;
    output.costPrice = product.costPrice.amountValue;
    output.currency = product.costPrice.currencyValue;
    output.isActive = product.isActive;
    return output;
  }
}
