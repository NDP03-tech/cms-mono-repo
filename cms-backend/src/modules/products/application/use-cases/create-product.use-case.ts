import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';

import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductInput } from '../dtos/create-product.input';
import { SKU } from '../../domain/value-objects/sku.vo';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  private constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}

  async execute(props: CreateProductInput) {
    const skuExist = this.repo.findBySku(SKU.create(props.sku));
    if (skuExist) throw new Error(`SKU ${skuExist} da ton tai roi`);
    const product = Product.create({
      sku: props.sku,
      name: props.name,
      costPrice: props.costPrice,
      currency: props.currency,
      unit: props.unit,
    });
    await this.repo.save(product);
    return product.id;
  }
}
