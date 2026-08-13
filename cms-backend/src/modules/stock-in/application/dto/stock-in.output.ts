import { StockIn } from '../../domain/entities/stock-in.entity';
import { StockInItem } from '../../domain/entities/stock-in-item.entity';
import { StockInStatus } from '../../domain/enums/stock-in-status.enum';

export interface StockInItemEnrichment {
  productName?: string;
  productSku?: string;
}

export interface StockInEnrichment {
  supplierName?: string;
  createdByName?: string;
  items?: Record<string, StockInItemEnrichment | undefined>;
}

export class StockInItemOutput {
  id: string;
  productId: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;

  static from(
    item: StockInItem,
    enrichment?: StockInItemEnrichment,
  ): StockInItemOutput {
    const output = new StockInItemOutput();
    output.id = item.id;
    output.productId = item.productId;
    output.productName = enrichment?.productName;
    output.productSku = enrichment?.productSku;
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
  supplierName?: string;
  createdBy: string;
  createdByName?: string;
  status: StockInStatus;
  totalAmount: number;
  currency: string;
  items: StockInItemOutput[];
  approvedAt?: Date;
  createdAt: Date;

  static from(stockIn: StockIn, enrichment?: StockInEnrichment): StockInOutput {
    const output = new StockInOutput();
    output.id = stockIn.id;
    output.code = stockIn.code.toString();
    output.supplierId = stockIn.supplierId;
    output.supplierName = enrichment?.supplierName;
    output.createdBy = stockIn.createdBy;
    output.createdByName = enrichment?.createdByName;
    output.status = stockIn.status;
    output.totalAmount = stockIn.totalAmount.amountValue;
    output.currency = stockIn.totalAmount.currencyValue;
    output.items = stockIn.items.map((item) =>
      StockInItemOutput.from(item, enrichment?.items?.[item.productId]),
    );
    output.approvedAt = stockIn.approvedAt;
    output.createdAt = stockIn.createdAt;
    return output;
  }
}
