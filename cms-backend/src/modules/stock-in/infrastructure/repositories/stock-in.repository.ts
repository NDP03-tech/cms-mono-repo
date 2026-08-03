import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IStockInRepository,
  StockInFilters,
} from '../../domain/repositories/stock-in.repository.interface';
import { StockIn } from '../../domain/entities/stock-in.entity';
import { StockInOrmEntity } from '../persistence/stock-in.orm-entity';
import { StockInMapper } from '../mappers/stock-in.mapper';

@Injectable()
export class StockInRepository implements IStockInRepository {
  constructor(
    @InjectRepository(StockInOrmEntity)
    private readonly repo: Repository<StockInOrmEntity>,
  ) {}

  async findById(id: string): Promise<StockIn | null> {
    const orm = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
    return orm ? StockInMapper.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<StockIn | null> {
    const orm = await this.repo.findOne({
      where: { code },
      relations: { items: true },
    });
    return orm ? StockInMapper.toDomain(orm) : null;
  }

  async findAll(filters?: StockInFilters): Promise<StockIn[]> {
    const qb = this.repo.createQueryBuilder('stockIn');
    qb.leftJoinAndSelect('stockIn.items', 'item');

    if (filters?.code) {
      qb.andWhere('stockIn.code = :code', { code: filters.code });
    }

    if (filters?.supplierId) {
      qb.andWhere('stockIn.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }

    if (filters?.createdBy) {
      qb.andWhere('stockIn.createdBy = :createdBy', {
        createdBy: filters.createdBy,
      });
    }

    if (filters?.status) {
      qb.andWhere('stockIn.status = :status', { status: filters.status });
    }

    if (filters?.fromDate) {
      qb.andWhere('stockIn.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters?.toDate) {
      qb.andWhere('stockIn.createdAt <= :toDate', {
        toDate: filters.toDate,
      });
    }

    if (filters?.page && filters?.limit) {
      qb.skip((filters.page - 1) * filters.limit).take(filters.limit);
    }

    const rows = await qb.getMany();
    return rows.map(StockInMapper.toDomain);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  async save(stockIn: StockIn): Promise<void> {
    const orm = StockInMapper.toPersistence(stockIn);
    await this.repo.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
