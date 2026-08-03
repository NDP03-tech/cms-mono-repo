// infrastructure/mappers/supplier.mapper.ts
import { Phone } from '../../domain/value-objects/phone.vo';
import { Address } from '../../domain/value-objects/address.vo';
import { Supplier } from '../../domain/entities/supplier.entity';
import { SupplierOrmEntity } from '../persistence/supplier.orm-entity';

export class SupplierMapper {
  static toDomain(orm: SupplierOrmEntity): Supplier {
    return Supplier.reconstitute({
      id: orm.id,
      name: orm.name,
      phone: orm.phone ? Phone.create(orm.phone) : undefined,
      address: orm.address ? Address.create(orm.address) : undefined,
      email: orm.email ?? undefined,
      isActive: orm.isActive,
    });
  }

  static toPersistence(supplier: Supplier): SupplierOrmEntity {
    const orm = new SupplierOrmEntity();
    orm.id = supplier.id;
    orm.name = supplier.name;
    orm.phone = supplier.phone?.toString() ?? null;
    orm.address = supplier.address?.toString() ?? null;
    orm.email = supplier.email ?? null;
    orm.isActive = supplier.isActive;
    return orm;
  }
}
