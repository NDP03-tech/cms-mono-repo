// infrastructure/mappers/inventory-transaction.mapper.ts
import { InventoryTransaction } from '../../domain/entities/inventory-transaction.entity';
import { InventoryTransactionOrmEntity } from '../persistence/inventory-transaction.orm-entity';

export class InventoryTransactionMapper {
  static toDomain(orm: InventoryTransactionOrmEntity): InventoryTransaction {
    return InventoryTransaction.reconstitute({
      id: orm.id,
      productId: orm.productId,
      type: orm.type,
      quantity: Number(orm.quantity),
      referenceId: orm.referenceId,
      referenceType: orm.referenceType,
      createdAt: orm.createdAt,
    });
  }

  static toPersistence(
    transaction: InventoryTransaction,
  ): InventoryTransactionOrmEntity {
    const orm = new InventoryTransactionOrmEntity();
    orm.id = transaction.id;
    orm.productId = transaction.productId;
    orm.type = transaction.type;
    orm.quantity = transaction.quantity;
    orm.referenceId = transaction.referenceId;
    orm.referenceType = transaction.referenceType;
    orm.createdAt = transaction.createdAt;
    return orm;
  }
}
