import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity('attribute_values')
@Index(['attribute_id', 'value'], { unique: true })
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int' })
  attribute_id?: number;

  @Column({ type: 'varchar', length: 255 })
  value?: string;

  @ManyToOne('Attribute', 'attributeValues', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute?: any;

  @OneToMany('VariantAttribute', 'attributeValue', { cascade: true })
  variantAttributes?: any[];
}
