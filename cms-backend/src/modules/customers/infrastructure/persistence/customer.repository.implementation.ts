import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ICustomerRepository,
  CustomerFilters,
} from '../../domain/repositories/customer.repository.interface';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../orm/customer.orm-entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? CustomerMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const orm = await this.repository.findOneBy({ email });
    return orm ? CustomerMapper.toDomain(orm) : null;
  }

  async findAll(filters?: CustomerFilters): Promise<Customer[]> {
    const query = this.repository.createQueryBuilder('customer');

    if (filters?.name) {
      query.andWhere('customer.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.email) {
      query.andWhere('customer.email ILIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('customer.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters?.page && filters?.limit) {
      const skip = (filters.page - 1) * filters.limit;
      query.skip(skip).take(filters.limit);
    }

    const ormEntities = await query.getMany();
    return ormEntities.map((orm) => CustomerMapper.toDomain(orm));
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.countBy({ id });
    return count > 0;
  }

  async save(customer: Customer): Promise<void> {
    const orm = CustomerMapper.toPersistence(customer);
    await this.repository.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
