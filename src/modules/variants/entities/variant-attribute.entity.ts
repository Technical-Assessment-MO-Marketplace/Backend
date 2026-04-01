import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';

@Entity('variant_attributes')
@Index(['variant_id', 'attribute_value_id'], { unique: true })
export class VariantAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  variant_id: number;

  @Column({ type: 'int' })
  attribute_value_id: number;

  @ManyToOne('Variant', 'variantAttributes', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: any;

  @ManyToOne('AttributeValue', 'variantAttributes', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_value_id' })
  attributeValue: any;
}
