import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '../customers/infrastructure/customers.module';
// Đường dẫn dưới đây suy theo pattern của CustomersModule ('../customers/infrastructure/customers.module')
// và theo cách stock-out.controller.ts import JwtAuthGuard ('../../auth/infrastructure/guards/jwt-auth.guard').
// Nếu AuthModule thật sự nằm ở path khác, chỉnh lại dòng import này.
import { AuthModule } from '../auth/infrastructure/auth.module';

import { StockOutController } from './presentation/stock-out.controller';

import { CreateStockOutUseCase } from './application/use-cases/create-stock-out.use-case';
import { AddStockOutItemUseCase } from './application/use-cases/add-stock-out-item.use-case';
import { UpdateStockOutItemUseCase } from './application/use-cases/update-stock-out-item.use-case';
import { RemoveStockOutItemUseCase } from './application/use-cases/remove-stock-out-item.use-case';
import { SubmitStockOutUseCase } from './application/use-cases/submit-stock-out.use-case';
import { ApproveStockOutUseCase } from './application/use-cases/approve-stock-out.use-case';
import { RejectStockOutUseCase } from './application/use-cases/reject-stock-out.use-case';
import { GetStockOutUseCase } from './application/use-cases/get-stock-out.use-case';
import { ListStockOutsUseCase } from './application/use-cases/list-stock-outs.use-case';

import { StockOutRepository } from './infrastructure/repositories/stock-out.repository';
import { StockOutOrmEntity } from './infrastructure/persistence/stock-out.orm-entity';
import { StockOutItemOrmEntity } from './infrastructure/persistence/stock-out-item.orm-entity';

import { STOCK_OUT_REPOSITORY } from './domain/repositories/stock-out.repository.interface';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockOutOrmEntity, StockOutItemOrmEntity]),

    CustomersModule,
    InventoryModule,
    AuthModule,
  ],

  controllers: [StockOutController],

  providers: [
    CreateStockOutUseCase,
    AddStockOutItemUseCase,
    UpdateStockOutItemUseCase,
    RemoveStockOutItemUseCase,
    SubmitStockOutUseCase,
    ApproveStockOutUseCase,
    RejectStockOutUseCase,
    GetStockOutUseCase,
    ListStockOutsUseCase,

    {
      provide: STOCK_OUT_REPOSITORY,
      useClass: StockOutRepository,
    },
  ],

  exports: [STOCK_OUT_REPOSITORY],
})
export class StockOutModule {}
