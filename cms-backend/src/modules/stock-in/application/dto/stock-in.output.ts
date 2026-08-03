// application/dto/stock-in.output.ts
import { StockIn } from '../../domain/entities/stock-in.entity';
import { StockInItem } from '../../domain/entities/stock-in-item.entity';
import { StockInStatus } from '../../domain/enums/stock-in-status.enum';

export class StockInItemOutput {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;

  static from(item: StockInItem): StockInItemOutput {
    const output = new StockInItemOutput();
    output.id = item.id;
    output.productId = item.productId;
    output.quantity = item.quantity;
    output.unitPrice = item.unitPrice.amountValue;
    output.totalPrice = item.totalPrice.amountValue;
    output.currency = item.unitPrice.currencyValue;
    return output;
  }
}

export class StockInOutput {
  id: string;
  code: string;
  supplierId: string;
  createdBy: string;
  status: StockInStatus;
  totalAmount: number;
  currency: string;
  items: StockInItemOutput[];
  approvedAt?: Date;
  createdAt: Date;

  static from(stockIn: StockIn): StockInOutput {
    const output = new StockInOutput();
    output.id = stockIn.id;
    output.code = stockIn.code.toString();
    output.supplierId = stockIn.supplierId;
    output.createdBy = stockIn.createdBy;
    output.status = stockIn.status;
    output.totalAmount = stockIn.totalAmount.amountValue;
    output.currency = stockIn.totalAmount.currencyValue;
    output.items = stockIn.items.map(StockInItemOutput.from);
    output.approvedAt = stockIn.approvedAt;
    output.createdAt = stockIn.createdAt;
    return output;
  }
}
