// infrastructure/mappers/stock-in.mapper.ts
import { Money } from '../../../products/domain/value-objects/money.vo';
import { StockInCode } from '../../domain/value-objects/stock-in-code.vo';
import { StockIn } from '../../domain/entities/stock-in.entity';
import { StockInItem } from '../../domain/entities/stock-in-item.entity';
import { StockInOrmEntity } from '../persistence/stock-in.orm-entity';
import { StockInItemOrmEntity } from '../persistence/stock-in-item.orm-entity';

export class StockInMapper {
  static toDomain(orm: StockInOrmEntity): StockIn {
    return StockIn.reconstitute({
      id: orm.id,
      code: StockInCode.reconstitute(orm.code),
      supplierId: orm.supplierId,
      createdBy: orm.createdBy,
      status: orm.status,
      totalAmount: Money.create(orm.totalAmount, orm.currency),
      items: (orm.items ?? []).map(StockInMapper.toItemDomain),
      approvedAt: orm.approvedAt ?? undefined,
      createdAt: orm.createdAt,
    });
  }

  static toItemDomain(orm: StockInItemOrmEntity): StockInItem {
    return StockInItem.reconstitute({
      id: orm.id,
      stockInId: orm.stockInId,
      productId: orm.productId,
      quantity: orm.quantity,
      unitPrice: Money.create(orm.unitPrice, orm.currency),
      totalPrice: Money.create(orm.totalPrice, orm.currency),
    });
  }

  static toPersistence(stockIn: StockIn): StockInOrmEntity {
    const orm = new StockInOrmEntity();
    orm.id = stockIn.id;
    orm.code = stockIn.code.toString();
    orm.supplierId = stockIn.supplierId;
    orm.createdBy = stockIn.createdBy;
    orm.status = stockIn.status;
    orm.totalAmount = stockIn.totalAmount.amountValue;
    orm.currency = stockIn.totalAmount.currencyValue;
    orm.approvedAt = stockIn.approvedAt ?? null;
    orm.createdAt = stockIn.createdAt;
    orm.items = stockIn.items.map(StockInMapper.toItemPersistence);
    return orm;
  }

  static toItemPersistence(item: StockInItem): StockInItemOrmEntity {
    const orm = new StockInItemOrmEntity();
    orm.id = item.id;
    orm.stockInId = item.stockInId;
    orm.productId = item.productId;
    orm.quantity = item.quantity;
    orm.unitPrice = item.unitPrice.amountValue;
    orm.totalPrice = item.totalPrice.amountValue;
    orm.currency = item.unitPrice.currencyValue;
    return orm;
  }
}
