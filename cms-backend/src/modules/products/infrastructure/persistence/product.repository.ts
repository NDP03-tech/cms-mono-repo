import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
  ProductFilters,
} from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import type { SKU } from '../../domain/value-objects/sku.vo';
import { ProductOrmEntity } from '../orm/product.orm-entity';
import { ProductMapper } from '../mapper/product.mapper';

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly repo: Repository<ProductOrmEntity>;

  constructor(
    @InjectRepository(ProductOrmEntity)
    ormRepo: Repository<ProductOrmEntity>,
  ) {
    this.repo = ormRepo as Repository<ProductOrmEntity>;
  }

  async findById(id: string): Promise<Product | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    return ProductMapper.toDomain(found);
  }

  async findBySku(sku: SKU): Promise<Product | null> {
    const found = await this.repo.findOne({ where: { sku: sku.toString() } });
    if (!found) return null;
    return ProductMapper.toDomain(found);
  }

  async findByName(name: string): Promise<Product[]> {
    const found = await this.repo.find({ where: { name: Like(`%${name}%`) } });
    return found.map((f) => ProductMapper.toDomain(f));
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const qb = this.repo.createQueryBuilder('p');

    if (filters) {
      if (filters.name)
        qb.andWhere('p.name ILIKE :name', { name: `%${filters.name}%` });
      if (filters.sku) qb.andWhere('p.sku = :sku', { sku: filters.sku });
      if (filters.isActive !== undefined)
        qb.andWhere('p.isActive = :isActive', { isActive: filters.isActive });
      if (filters.currency)
        qb.andWhere('p.currency = :currency', { currency: filters.currency });
      if (filters.unit) qb.andWhere('p.unit = :unit', { unit: filters.unit });
      if (filters.minPrice !== undefined)
        qb.andWhere('p.amount >= :min', { min: filters.minPrice });
      if (filters.maxPrice !== undefined)
        qb.andWhere('p.amount <= :max', { max: filters.maxPrice });
      if (filters.page !== undefined && filters.limit !== undefined) {
        const take = filters.limit;
        const skip = (Math.max(1, filters.page) - 1) * take;
        qb.skip(skip).take(take);
      }
    }

    const rows = await qb.getMany();
    return rows.map((r) => ProductMapper.toDomain(r));
  }
  async findByIds(ids: string[]): Promise<Product[]> {
    const validIds = ids
      .map((id) => id.trim())
      .filter(
        (id) =>
          id.length > 0 &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            id,
          ),
      );

    if (validIds.length === 0) return [];

    const found = await this.repo.find({ where: { id: In(validIds) } });
    return found.map((f) => ProductMapper.toDomain(f));
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repo.count({ where: { id } });
    return count > 0;
  }

  async existsBySku(sku: SKU): Promise<boolean> {
    const count = await this.repo.count({ where: { sku: sku.toString() } });
    return count > 0;
  }

  async save(product: Product): Promise<void> {
    const orm = ProductMapper.toPersistence(product);
    await this.repo.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}

export const ProductRepositoryProvider = {
  provide: PRODUCT_REPOSITORY,
  useClass: ProductRepository,
};
