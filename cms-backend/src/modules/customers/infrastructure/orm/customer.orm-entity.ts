import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  email: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  address: string | null;
}
