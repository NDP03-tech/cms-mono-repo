// infrastructure/persistence/stock-in.orm-entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockInStatus } from '../../domain/enums/stock-in-status.enum';
import { StockInItemOrmEntity } from './stock-in-item.orm-entity';

@Entity('stock_in')
export class StockInOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  supplierId: string;

  @Column()
  createdBy: string;

  @Column({ type: 'enum', enum: StockInStatus, default: StockInStatus.DRAFT })
  status: StockInStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 10 })
  currency: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  approvedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => StockInItemOrmEntity, (item) => item.stockIn, {
    cascade: true,
  })
  items: StockInItemOrmEntity[];
}
