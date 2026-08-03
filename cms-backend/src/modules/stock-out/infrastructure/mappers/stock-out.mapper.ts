// infrastructure/mappers/stock-out.mapper.ts
import { Money } from '../../../products/domain/value-objects/money.vo';
import { StockOutCode } from '../../domain/value-objects/stock-out-code.vo';
import { StockOut } from '../../domain/entities/stock-out.entity';
import { StockOutItem } from '../../domain/entities/stock-out-item.entity';
import { StockOutOrmEntity } from '../persistence/stock-out.orm-entity';
import { StockOutItemOrmEntity } from '../persistence/stock-out-item.orm-entity';

export class StockOutMapper {
  static toDomain(orm: StockOutOrmEntity): StockOut {
    return StockOut.reconstitute({
      id: orm.id,
      code: StockOutCode.reconstitute(orm.code),
      customerId: orm.customerId,
      createdBy: orm.createdBy,
      status: orm.status,
      totalAmount: Money.create(orm.totalAmount, orm.currency),
      items: (orm.items ?? []).map(StockOutMapper.toItemDomain),
      approvedAt: orm.approvedAt ?? undefined,
      createdAt: orm.createdAt,
    });
  }

  static toItemDomain(orm: StockOutItemOrmEntity): StockOutItem {
    return StockOutItem.reconstitute({
      id: orm.id,
      stockOutId: orm.stockOutId,
      productId: orm.productId,
      quantity: orm.quantity,
      unitPrice: Money.create(orm.unitPrice, orm.currency),
    });
  }

  static toPersistence(stockOut: StockOut): StockOutOrmEntity {
    const orm = new StockOutOrmEntity();
    orm.id = stockOut.id;
    orm.code = stockOut.code.toString();
    orm.customerId = stockOut.customerId;
    orm.createdBy = stockOut.createdBy;
    orm.status = stockOut.status;
    orm.totalAmount = stockOut.totalAmount.amountValue;
    orm.currency = stockOut.totalAmount.currencyValue;
    orm.approvedAt = stockOut.approvedAt ?? null;
    orm.createdAt = stockOut.createdAt;
    orm.items = stockOut.items.map(StockOutMapper.toItemPersistence);
    return orm;
  }

  static toItemPersistence(item: StockOutItem): StockOutItemOrmEntity {
    const orm = new StockOutItemOrmEntity();
    orm.id = item.id;
    orm.stockOutId = item.stockOutId;
    orm.productId = item.productId;
    orm.quantity = item.quantity;
    orm.unitPrice = item.unitPrice.amountValue;
    orm.totalPrice = item.totalPrice.amountValue;
    orm.currency = item.unitPrice.currencyValue;
    return orm;
  }
}
