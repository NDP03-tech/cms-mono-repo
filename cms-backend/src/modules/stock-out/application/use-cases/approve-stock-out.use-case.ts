// application/use-cases/approve-stock-out.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';

import { RecordStockOutUseCase } from '../../../inventory/application/use-cases/record-stock-out.use-case';

@Injectable()
export class ApproveStockOutUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
    private readonly recordStockOut: RecordStockOutUseCase,
  ) {}

  // application/use-cases/approve-stock-out.use-case.ts
  async execute(id: string): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(id);
    if (!stockOut) throw new Error(`StockOut ${id} not found`);

    stockOut.approve(); // chỉ đổi state trong memory

    // Trừ tồn kho + ghi transaction TRƯỚC — nếu throw (ví dụ thiếu balance,
    // không đủ tồn) thì stockOut.save() phía dưới sẽ KHÔNG chạy, status vẫn
    // giữ nguyên PENDING, có thể sửa dữ liệu rồi bấm duyệt lại bình thường.
    await this.recordStockOut.execute(stockOut);

    await this.stockOutRepo.save(stockOut); // chỉ lưu khi trừ kho thành công
  }
}
