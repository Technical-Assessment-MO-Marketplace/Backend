import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name?: string;

  @OneToMany('AttributeValue', 'attribute', { cascade: true })
  attributeValues?: any[];
}
