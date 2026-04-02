import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity('variants')
@Index(['product_id', 'combination_key'], { unique: true })
export class Variant {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int' })
  product_id?: number;

  @Column({ type: 'varchar', length: 255 })
  combination_key?: string;

  @Column({ type: 'float' })
  price?: number;

  @Column({ type: 'int' })
  stock?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @ManyToOne('Product', 'variants', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: any;
}
