import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './presentation/inventory.controller';
import { InventoryBalanceOrmEntity } from './infrastructure/persistence/inventory-balance.orm-entity';
import { InventoryTransactionOrmEntity } from './infrastructure/persistence/inventory-transaction.orm-entity';
import { InventoryBalanceRepository } from './infrastructure/repositories/inventory-balance.repository';
import { InventoryTransactionRepository } from './infrastructure/repositories/inventory-transaction.repository';
import { INVENTORY_BALANCE_REPOSITORY } from './domain/repositories/inventory-balance.repository.interface';
import { INVENTORY_TRANSACTION_REPOSITORY } from './domain/repositories/inventory-transaction.repository.interface';
import { GetInventoryBalanceUseCase } from './application/use-cases/get-inventory-balance.use-case';
import { ListInventoryBalancesUseCase } from './application/use-cases/list-inventory-balances.use-case';
import { ListInventoryTransactionsUseCase } from './application/use-cases/list-inventory-transactions.use-case';
import { AdjustInventoryUseCase } from './application/use-cases/adjust-inventory.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryBalanceOrmEntity,
      InventoryTransactionOrmEntity,
    ]),
  ],
  controllers: [InventoryController],
  providers: [
    GetInventoryBalanceUseCase,
    ListInventoryBalancesUseCase,
    ListInventoryTransactionsUseCase,
    AdjustInventoryUseCase,
    {
      provide: INVENTORY_BALANCE_REPOSITORY,
      useClass: InventoryBalanceRepository,
    },
    {
      provide: INVENTORY_TRANSACTION_REPOSITORY,
      useClass: InventoryTransactionRepository,
    },
  ],
  exports: [INVENTORY_BALANCE_REPOSITORY, INVENTORY_TRANSACTION_REPOSITORY],
})
export class InventoryModule {}
