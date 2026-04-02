import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { Variant } from '../../products/entities/variant.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
@Index(['order_id'])
@Index(['variant_id'])
@Index(['product_id'])
export class OrderItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int' })
  order_id?: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @Column({ type: 'int' })
  product_id?: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @Column({ type: 'int' })
  variant_id?: number;

  @ManyToOne(() => Variant, { eager: true })
  @JoinColumn({ name: 'variant_id' })
  variant?: Variant;

  @Column({ type: 'int' })
  quantity?: number;

  @Column({ type: 'float', comment: 'Price at time of order' })
  price?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
