import { Product } from '../../domain/entities/product.entity';
import { ProductOrmEntity } from '../orm/product.orm-entity';
import { SKU } from '../../domain/value-objects/sku.vo';
import { Money } from '../../domain/value-objects/money.vo';

export class ProductMapper {
  public static toDomain(orm: ProductOrmEntity): Product {
    return Product.reconstitute({
      id: orm.id,
      sku: SKU.create(orm.sku),
      unit: orm.unit,
      isActive: orm.isActive,
      name: orm.name,
      costPrice: Money.create(orm.amount, orm.currency),
    });
  }

  public static toPersistence(domain: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = domain.id;
    orm.amount = domain.costPrice.amountValue;
    orm.currency = domain.costPrice.currencyValue;
    orm.isActive = domain.isActive;
    orm.sku = domain.sku.toString();
    orm.unit = domain.unit;
    orm.name = domain.name;
    return orm;
  }
}
