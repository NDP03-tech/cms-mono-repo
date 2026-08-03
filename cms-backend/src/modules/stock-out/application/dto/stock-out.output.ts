// application/dto/stock-out.output.ts
import { StockOut } from '../../domain/entities/stock-out.entity';
import { StockOutItem } from '../../domain/entities/stock-out-item.entity';
import { StockOutEnum } from '../../domain/enums/stock-out-status.enum';

export class StockOutItemOutput {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;

  static from(item: StockOutItem): StockOutItemOutput {
    const output = new StockOutItemOutput();
    output.id = item.id;
    output.productId = item.productId;
    output.quantity = item.quantity;
    output.unitPrice = item.unitPrice.amountValue;
    output.totalPrice = item.totalPrice.amountValue;
    output.currency = item.unitPrice.currencyValue;
    return output;
  }
}

export class StockOutOutput {
  id: string;
  code: string;
  customerId: string;
  createdBy: string;
  status: StockOutEnum;
  totalAmount: number;
  currency: string;
  items: StockOutItemOutput[];
  approvedAt?: Date;
  createdAt: Date;

  static from(stockOut: StockOut): StockOutOutput {
    const output = new StockOutOutput();
    output.id = stockOut.id;
    output.code = stockOut.code.toString();
    output.customerId = stockOut.customerId;
    output.createdBy = stockOut.createdBy;
    output.status = stockOut.status;
    output.totalAmount = stockOut.totalAmount.amountValue;
    output.currency = stockOut.totalAmount.currencyValue;
    output.items = stockOut.items.map(StockOutItemOutput.from);
    output.approvedAt = stockOut.approvedAt;
    output.createdAt = stockOut.createdAt;
    return output;
  }
}
