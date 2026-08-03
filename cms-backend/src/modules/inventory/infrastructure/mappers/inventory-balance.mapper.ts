// infrastructure/mappers/inventory-balance.mapper.ts
import { InventoryBalance } from '../../domain/entities/inventory-balance.entity';
import { InventoryBalanceOrmEntity } from '../persistence/inventory-balance.orm-entity';

export class InventoryBalanceMapper {
  static toDomain(orm: InventoryBalanceOrmEntity): InventoryBalance {
    return InventoryBalance.reconstitute({
      id: orm.id,
      productId: orm.productId,
      quantity: Number(orm.quantity),
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(balance: InventoryBalance): InventoryBalanceOrmEntity {
    const orm = new InventoryBalanceOrmEntity();
    orm.id = balance.id;
    orm.productId = balance.productId;
    orm.quantity = balance.quantity;
    orm.updatedAt = balance.updatedAt;
    return orm;
  }
}
