import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectRepository(OrderItem)
    private repository: Repository<OrderItem>,
  ) {}

  async create(data: {
    order_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
    price: number;
  }): Promise<OrderItem> {
    const orderItem = this.repository.create(data);
    return this.repository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.repository.find({
      relations: ['order', 'product', 'variant'],
    });
  }

  async findById(id: number): Promise<OrderItem | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['order', 'product', 'variant'],
    });
  }

  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.repository.find({
      where: { order_id: orderId },
      relations: ['product', 'variant'],
    });
  }

  async update(
    id: number,
    data: Partial<OrderItem>,
  ): Promise<OrderItem | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const orderItem = await this.repository.findOne({
      where: { id },
    });
    if (orderItem) {
      await this.repository.remove(orderItem);
    }
  }
}
