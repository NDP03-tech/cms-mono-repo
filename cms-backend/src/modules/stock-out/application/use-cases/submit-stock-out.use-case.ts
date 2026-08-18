// stock-out/application/use-cases/submit-stock-out.use-case.ts

import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import {
  type IStockOutRepository,
  STOCK_OUT_REPOSITORY,
} from '../../domain/repositories/stock-out.repository.interface';

import { CheckStockAvailabilityUseCase } from '../../../inventory/application/use-cases/check-stock-availability.use-case';

@Injectable()
export class SubmitStockOutUseCase {
  private readonly logger = new Logger(SubmitStockOutUseCase.name);

  constructor(
    @Inject(STOCK_OUT_REPOSITORY)
    private readonly stockOutRepo: IStockOutRepository,

    private readonly checkAvailability: CheckStockAvailabilityUseCase,
  ) {}

  async execute(stockOutId: string): Promise<void> {
    this.logger.log(`[SUBMIT] Start submit stock-out: ${stockOutId}`);

    try {
      // ============================================================
      // 1. Find stock out
      // ============================================================

      this.logger.log(`[SUBMIT] Finding stock-out: ${stockOutId}`);

      const stockOut = await this.stockOutRepo.findById(stockOutId);

      if (!stockOut) {
        this.logger.error(`[SUBMIT] Stock-out not found: ${stockOutId}`);

        throw new BadRequestException(`Stock-out ${stockOutId} không tồn tại`);
      }

      this.logger.log(
        `[SUBMIT] Stock-out found: ${JSON.stringify({
          id: stockOut.id,
          code: stockOut.code,
          status: stockOut.status,
          customerId: stockOut.customerId,
          createdBy: stockOut.createdBy,
          itemCount: stockOut.items?.length ?? 0,
        })}`,
      );

      // ============================================================
      // 2. Check items
      // ============================================================

      this.logger.log(`[SUBMIT] Checking stock-out items...`);

      if (!stockOut.items || stockOut.items.length === 0) {
        this.logger.error(`[SUBMIT] Stock-out has no items: ${stockOutId}`);

        throw new BadRequestException(
          'Phiếu xuất phải có ít nhất một sản phẩm',
        );
      }

      this.logger.log(
        `[SUBMIT] Items: ${JSON.stringify(
          stockOut.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        )}`,
      );

      // ============================================================
      // 3. Domain submit
      // ============================================================

      this.logger.log(`[SUBMIT] Calling stockOut.submit()...`);

      try {
        stockOut.submit();

        this.logger.log(
          `[SUBMIT] stockOut.submit() successful. New status: ${stockOut.status}`,
        );
      } catch (error) {
        this.logger.error(
          `[SUBMIT] stockOut.submit() failed`,
          error instanceof Error ? error.stack : String(error),
        );

        throw error;
      }

      // ============================================================
      // 4. Check stock availability
      // ============================================================

      const availabilityInput = stockOut.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      this.logger.log(
        `[SUBMIT] Checking stock availability: ${JSON.stringify(
          availabilityInput,
        )}`,
      );

      let result;

      try {
        result = await this.checkAvailability.execute(availabilityInput);

        this.logger.log(
          `[SUBMIT] Stock availability result: ${JSON.stringify(result)}`,
        );
      } catch (error) {
        this.logger.error(
          `[SUBMIT] CheckStockAvailability failed`,
          error instanceof Error ? error.stack : String(error),
        );

        throw error;
      }

      // ============================================================
      // 5. Not enough stock
      // ============================================================

      if (!result.available) {
        const detail = result.shortages
          .map(
            (s) =>
              `sản phẩm ${s.productId} (cần ${s.requested}, còn ${s.available})`,
          )
          .join('; ');

        this.logger.error(`[SUBMIT] Stock unavailable: ${detail}`);

        throw new BadRequestException(`Không đủ tồn kho: ${detail}`);
      }

      this.logger.log(`[SUBMIT] Stock availability check passed`);

      // ============================================================
      // 6. Save
      // ============================================================

      this.logger.log(`[SUBMIT] Saving stock-out: ${stockOutId}`);

      try {
        await this.stockOutRepo.save(stockOut);

        this.logger.log(`[SUBMIT] Stock-out saved successfully: ${stockOutId}`);
      } catch (error) {
        this.logger.error(
          `[SUBMIT] Failed to save stock-out: ${stockOutId}`,
          error instanceof Error ? error.stack : String(error),
        );

        throw error;
      }

      // ============================================================
      // 7. Success
      // ============================================================

      this.logger.log(`[SUBMIT] Submit completed successfully: ${stockOutId}`);
    } catch (error) {
      this.logger.error(
        `[SUBMIT] Submit failed: ${stockOutId}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
