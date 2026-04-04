import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
  ) {}

  async create(data: {
    user_id: number;
    total_amount: number;
    status?: 'pending' | 'completed' | 'cancelled' | 'shipped';
  }): Promise<Order> {
    const order = this.repository.create(data);
    return this.repository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ['items', 'items.product', 'items.variant', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Order | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.variant', 'user'],
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.repository.find({
      where: { user_id: userId },
      relations: ['items', 'items.product', 'items.variant'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, data: Partial<Order>): Promise<Order | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const order = await this.repository.findOne({
      where: { id },
    });
    if (order) {
      await this.repository.remove(order);
    }
  }
}
