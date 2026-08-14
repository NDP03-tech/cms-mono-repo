// stock-out/application/use-cases/submit-stock-out.use-case.ts
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';
import { CheckStockAvailabilityUseCase } from '../../../inventory/application/use-cases/check-stock-availability.use-case';

@Injectable()
export class SubmitStockOutUseCase {
  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,
    private readonly checkAvailability: CheckStockAvailabilityUseCase,
  ) {}

  async execute(stockOutId: string): Promise<void> {
    const stockOut = await this.stockOutRepo.findById(stockOutId);
    if (!stockOut) throw new Error(`${stockOutId} is not found`);

    // Giữ nguyên guard cũ của domain: phải DRAFT + có ít nhất 1 item.
    stockOut.submit();

    // Kiểm tra tồn kho TRƯỚC khi lưu — nếu thiếu hàng, throw ngay tại đây,
    // status vẫn giữ nguyên DRAFT trong DB (chưa save() nên không bị lệch).
    const result = await this.checkAvailability.execute(
      stockOut.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );

    if (!result.available) {
      const detail = result.shortages
        .map(
          (s) =>
            `sản phẩm ${s.productId} (cần ${s.requested}, còn ${s.available})`,
        )
        .join('; ');
      throw new BadRequestException(`Không đủ tồn kho: ${detail}`);
    }

    await this.stockOutRepo.save(stockOut);
  }
}
