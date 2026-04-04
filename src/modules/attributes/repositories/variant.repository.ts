import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../../variants/entities/variant.entity';

@Injectable()
export class VariantRepository {
  constructor(
    @InjectRepository(Variant)
    private repository: Repository<Variant>,
  ) {}

  async create(data: {
    product_id: number;
    combination_key: string;
    price: number;
    stock: number;
  }): Promise<Variant> {
    const variant = this.repository.create(data);
    return this.repository.save(variant);
  }

  async findAll(): Promise<Variant[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Variant | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    const variant = await this.repository.findOne({
      where: { id },
    });
    if (variant) {
      await this.repository.remove(variant);
    }
  }
}
