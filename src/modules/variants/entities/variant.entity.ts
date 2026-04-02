import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('variants')
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

  @OneToMany('VariantAttribute', 'variant', { cascade: true })
  variantAttributes?: any[];
}
