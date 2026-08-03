// infrastructure/persistence/inventory-transaction.orm-entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InventoryTransactionType } from '../../domain/enums/inventory-transaction-type.enum';

@Entity('inventory_transactions')
export class InventoryTransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ type: 'enum', enum: InventoryTransactionType })
  type: InventoryTransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  quantity: number;

  @Column()
  referenceId: string;

  @Column()
  referenceType: string;

  @CreateDateColumn()
  createdAt: Date;
}
