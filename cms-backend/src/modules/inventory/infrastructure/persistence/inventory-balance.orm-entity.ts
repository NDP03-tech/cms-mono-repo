// infrastructure/persistence/inventory-balance.orm-entity.ts
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory_balances')
export class InventoryBalanceOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  productId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  quantity: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
