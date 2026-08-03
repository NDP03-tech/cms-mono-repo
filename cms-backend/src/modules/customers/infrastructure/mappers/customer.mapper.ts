import { Phone } from '../../../suppliers/domain/value-objects/phone.vo';
import { Email } from '../../domain/value-object/email.vo';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../orm/customer.orm-entity';

export class CustomerMapper {
  static toDomain(orm: CustomerOrmEntity): Customer {
    return Customer.reconstitute({
      id: orm.id,
      name: orm.name,
      phone: orm.phone ? Phone.create(orm.phone) : undefined,
      email: orm.email ? Email.create(orm.email) : undefined,
      isActive: orm.isActive,
    });
  }

  static toPersistence(customer: Customer): CustomerOrmEntity {
    const orm = new CustomerOrmEntity();
    orm.id = customer.id;
    orm.name = customer.name;
    orm.phone = customer.phone?.toString() ?? null;
    orm.email = customer.email?.toString() ?? null;
    orm.isActive = customer.isActive;
    return orm;
  }
}
