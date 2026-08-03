import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class GetProductUseCase {
  private constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product | null> {
    return this.repo.findById(id);
  }
}
