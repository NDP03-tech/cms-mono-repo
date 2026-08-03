import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IStockOutRepository,
  StockOutFilters,
} from '../../domain/repositories/stock-out.repository.interface';
import { StockOut } from '../../domain/entities/stock-out.entity';
import { StockOutOrmEntity } from '../persistence/stock-out.orm-entity';
import { StockOutMapper } from '../mappers/stock-out.mapper';

@Injectable()
export class StockOutRepository implements IStockOutRepository {
  constructor(
    @InjectRepository(StockOutOrmEntity)
    private readonly repo: Repository<StockOutOrmEntity>,
  ) {}

  async findById(id: string): Promise<StockOut | null> {
    const orm = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
    return orm ? StockOutMapper.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<StockOut | null> {
    const orm = await this.repo.findOne({
      where: { code },
      relations: { items: true },
    });
    return orm ? StockOutMapper.toDomain(orm) : null;
  }

  async findAll(filters?: StockOutFilters): Promise<StockOut[]> {
    const qb = this.repo.createQueryBuilder('stockOut');
    qb.leftJoinAndSelect('stockOut.items', 'item');

    if (filters?.code) {
      qb.andWhere('stockOut.code = :code', { code: filters.code });
    }

    if (filters?.customerId) {
      qb.andWhere('stockOut.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    if (filters?.createdBy) {
      qb.andWhere('stockOut.createdBy = :createdBy', {
        createdBy: filters.createdBy,
      });
    }

    if (filters?.status) {
      qb.andWhere('stockOut.status = :status', { status: filters.status });
    }

    if (filters?.fromDate) {
      qb.andWhere('stockOut.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters?.toDate) {
      qb.andWhere('stockOut.createdAt <= :toDate', {
        toDate: filters.toDate,
      });
    }

    if (filters?.page && filters?.limit) {
      qb.skip((filters.page - 1) * filters.limit).take(filters.limit);
    }

    const rows = await qb.getMany();
    return rows.map(StockOutMapper.toDomain);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  async save(stockOut: StockOut): Promise<void> {
    const orm = StockOutMapper.toPersistence(stockOut);
    await this.repo.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
