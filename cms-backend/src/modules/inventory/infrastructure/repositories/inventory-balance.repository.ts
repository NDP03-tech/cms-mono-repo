// infrastructure/repositories/inventory-balance.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IInventoryBalanceRepository,
  InventoryBalanceFilters,
} from '../../domain/repositories/inventory-balance.repository.interface';
import { InventoryBalance } from '../../domain/entities/inventory-balance.entity';
import { InventoryBalanceOrmEntity } from '../persistence/inventory-balance.orm-entity';
import { InventoryBalanceMapper } from '../mappers/inventory-balance.mapper';

@Injectable()
export class InventoryBalanceRepository implements IInventoryBalanceRepository {
  constructor(
    @InjectRepository(InventoryBalanceOrmEntity)
    private readonly repo: Repository<InventoryBalanceOrmEntity>,
  ) {}

  async findByProductId(productId: string): Promise<InventoryBalance | null> {
    const orm = await this.repo.findOne({ where: { productId } });
    return orm ? InventoryBalanceMapper.toDomain(orm) : null;
  }

  async findAll(
    filters?: InventoryBalanceFilters,
  ): Promise<InventoryBalance[]> {
    const qb = this.repo.createQueryBuilder('balance');

    if (filters?.productId) {
      qb.andWhere('balance.productId = :productId', {
        productId: filters.productId,
      });
    }

    if (filters?.minQuantity !== undefined) {
      qb.andWhere('balance.quantity >= :minQuantity', {
        minQuantity: filters.minQuantity,
      });
    }

    if (filters?.maxQuantity !== undefined) {
      qb.andWhere('balance.quantity <= :maxQuantity', {
        maxQuantity: filters.maxQuantity,
      });
    }

    if (filters?.page && filters?.limit) {
      qb.skip((filters.page - 1) * filters.limit).take(filters.limit);
    }

    const rows = await qb.getMany();
    return rows.map(InventoryBalanceMapper.toDomain);
  }

  async findLowStock(threshold: number): Promise<InventoryBalance[]> {
    const rows = await this.repo
      .createQueryBuilder('balance')
      .where('balance.quantity <= :threshold', { threshold })
      .orderBy('balance.quantity', 'ASC')
      .getMany();
    return rows.map(InventoryBalanceMapper.toDomain);
  }

  async save(balance: InventoryBalance): Promise<void> {
    const orm = InventoryBalanceMapper.toPersistence(balance);
    await this.repo.save(orm);
  }
}
