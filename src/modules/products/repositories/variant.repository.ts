import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../entities';

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

  async findByProductId(productId: number): Promise<Variant[]> {
    return this.repository.find({
      where: { product_id: productId },
    });
  }

  async findByProductAndCombinationKey(
    productId: number,
    combinationKey: string,
  ): Promise<Variant | null> {
    return this.repository.findOne({
      where: { product_id: productId, combination_key: combinationKey },
    });
  }

  async update(id: number, data: Partial<Variant>): Promise<Variant | null> {
    await this.repository.update(id, data);
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
