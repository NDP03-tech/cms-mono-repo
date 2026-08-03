import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ nullable: true, unique: true })
  email: string | null;

  @Column({ default: true })
  isActive: boolean;
}
