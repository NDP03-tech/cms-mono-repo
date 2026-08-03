// infrastructure/repositories/inventory-transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IInventoryTransactionRepository,
  InventoryTransactionFilters,
} from '../../domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransaction } from '../../domain/entities/inventory-transaction.entity';
import { InventoryTransactionOrmEntity } from '../persistence/inventory-transaction.orm-entity';
import { InventoryTransactionMapper } from '../mappers/inventory-transaction.mapper';

@Injectable()
export class InventoryTransactionRepository implements IInventoryTransactionRepository {
  constructor(
    @InjectRepository(InventoryTransactionOrmEntity)
    private readonly repo: Repository<InventoryTransactionOrmEntity>,
  ) {}

  async findById(id: string): Promise<InventoryTransaction | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? InventoryTransactionMapper.toDomain(orm) : null;
  }

  async findAll(
    filters?: InventoryTransactionFilters,
  ): Promise<InventoryTransaction[]> {
    const qb = this.repo.createQueryBuilder('transaction');

    if (filters?.productId) {
      qb.andWhere('transaction.productId = :productId', {
        productId: filters.productId,
      });
    }

    if (filters?.type) {
      qb.andWhere('transaction.type = :type', {
        type: filters.type,
      });
    }

    if (filters?.referenceId) {
      qb.andWhere('transaction.referenceId = :referenceId', {
        referenceId: filters.referenceId,
      });
    }

    if (filters?.referenceType) {
      qb.andWhere('transaction.referenceType = :referenceType', {
        referenceType: filters.referenceType,
      });
    }

    if (filters?.fromDate) {
      qb.andWhere('transaction.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters?.toDate) {
      qb.andWhere('transaction.createdAt <= :toDate', {
        toDate: filters.toDate,
      });
    }

    qb.orderBy('transaction.createdAt', 'DESC');

    if (filters?.page && filters?.limit) {
      qb.skip((filters.page - 1) * filters.limit).take(filters.limit);
    }

    const rows = await qb.getMany();
    return rows.map(InventoryTransactionMapper.toDomain);
  }

  async save(transaction: InventoryTransaction): Promise<void> {
    const orm = InventoryTransactionMapper.toPersistence(transaction);
    await this.repo.save(orm);
  }
}
