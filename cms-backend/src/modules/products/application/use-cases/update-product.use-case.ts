import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { UpdateProductInput } from '../dtos/update-product.input';

@Injectable()
export class UpdateProductUseCase {
  private constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}
  async execute(id: string, input: UpdateProductInput) {
    const existedProduct = await this.repo.findById(id);
    if (!existedProduct) throw new Error(`${id} khong ton tai`);
    if (input.name !== undefined) existedProduct.updateName(input.name);
    if (input.unit !== undefined) existedProduct.updateUnit(input.unit);
    if (input.costPrice !== undefined && input.currency !== undefined)
      existedProduct.updatePrice(input.costPrice, input.currency);
    if (input.isActive === true) existedProduct.activate();
    if (input.isActive === false) existedProduct.deactivate();

    await this.repo.save(existedProduct);
  }
}
