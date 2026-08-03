import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
@Injectable()
export class DeleteProductUseCase {
  private constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly repo: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existProduct = await this.repo.findById(id);
    if (!existProduct) throw new Error('Khong co the tim thay product can xoa');
    return await this.repo.delete(id);
  }
}
