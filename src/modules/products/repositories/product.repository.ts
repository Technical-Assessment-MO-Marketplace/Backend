import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async create(data: {
    name: string;
    description?: string;
    created_by: number;
  }): Promise<Product> {
    const product = this.repository.create(data);
    return this.repository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { name },
    });
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    const product = await this.repository.findOne({
      where: { id },
    });
    if (product) {
      await this.repository.remove(product);
    }
  }
}
