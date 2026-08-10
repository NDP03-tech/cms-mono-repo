// infrastructure/persistence/stock-out.orm-entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockOutEnum } from '../../domain/enums/stock-out-status.enum';
import { StockOutItemOrmEntity } from './stock-out-item.orm-entity';

@Entity('stock_out')
export class StockOutOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  customerId: string;

  @Column()
  createdBy: string;

  @Column({ type: 'enum', enum: StockOutEnum, default: StockOutEnum.DRAFT })
  status: StockOutEnum;

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

  @OneToMany(() => StockOutItemOrmEntity, (item) => item.stockOut, {
    cascade: true,
  })
  items: StockOutItemOrmEntity[];
}
