import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import type {
  ISupplierRepository,
  SupplierFilters,
} from '../../domain/repositories/supplier.repository.interface';
import { Supplier } from '../../domain/entities/supplier.entity';
import { SupplierOrmEntity } from './supplier.orm-entity';
import { SupplierMapper } from '../mappers/supplier.mapper';

@Injectable()
export class SupplierRepository implements ISupplierRepository {
  constructor(
    @InjectRepository(SupplierOrmEntity)
    private readonly repository: Repository<SupplierOrmEntity>,
  ) {}

  async findById(id: string): Promise<Supplier | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? SupplierMapper.toDomain(orm) : null;
  }

  async findByIds(ids: string[]): Promise<Supplier[]> {
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

    const ormEntities = await this.repository.findBy({ id: In(validIds) });
    return ormEntities.map((orm) => SupplierMapper.toDomain(orm));
  }

  async findByName(name: string): Promise<Supplier[]> {
    const ormEntities = await this.repository.find({
      where: { name },
    });
    return ormEntities.map((orm) => SupplierMapper.toDomain(orm));
  }

  async findAll(filters?: SupplierFilters): Promise<Supplier[]> {
    const query = this.repository.createQueryBuilder('supplier');

    if (filters?.name) {
      query.andWhere('supplier.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('supplier.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters?.page && filters?.limit) {
      const skip = (filters.page - 1) * filters.limit;
      query.skip(skip).take(filters.limit);
    }

    const ormEntities = await query.getMany();
    return ormEntities.map((orm) => SupplierMapper.toDomain(orm));
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.countBy({ id });
    return count > 0;
  }

  async save(supplier: Supplier): Promise<void> {
    const orm = SupplierMapper.toPersistence(supplier);
    await this.repository.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
