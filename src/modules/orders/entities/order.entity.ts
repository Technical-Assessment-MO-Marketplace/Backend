import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
@Index(['user_id'])
@Index(['status'])
@Index(['created_at'])
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int' })
  user_id?: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'float' })
  total_amount?: number;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
  })
  status?: 'pending' | 'completed' | 'cancelled' | 'shipped';

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items?: OrderItem[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
