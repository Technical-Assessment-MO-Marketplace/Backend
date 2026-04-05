import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Variant } from '../../products/entities/variant.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../auth/entities/user.entity';
import { CreateOrderDto, CreateOrderItemDto } from '../dto';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
    this.logger.log(
      `Creating order for user ${user.id} with ${createOrderDto.items.length} items`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // OPTIMIZATION: Batch fetch all products at once (avoid N queries)
      const productIds = [
        ...new Set(createOrderDto.items.map((i) => i.product_id)),
      ];
      const products = await queryRunner.manager.find(Product, {
        where: { id: In(productIds) },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      // OPTIMIZATION: Batch fetch all variants at once (avoid N queries)
      const variantIds = [
        ...new Set(createOrderDto.items.map((i) => i.variant_id)),
      ];
      const variants = await queryRunner.manager.find(Variant, {
        where: { id: In(variantIds) },
      });
      const variantMap = new Map(variants.map((v) => [v.id, v]));

      const orderItemsData: Array<{
        product: Product;
        variant: Variant;
        quantity: number;
        itemTotal: number;
      }> = [];

      let totalOrderAmount = 0;

      // Step 1: Validate all products and variants (using cached maps)
      for (const item of createOrderDto.items) {
        const product = productMap.get(item.product_id);

        if (!product) {
          throw new NotFoundException(
            `Product with id ${item.product_id} not found`,
          );
        }

        const variant = variantMap.get(item.variant_id);

        if (!variant) {
          throw new NotFoundException(
            `Variant with id ${item.variant_id} not found`,
          );
        }

        // Validate variant belongs to product
        if (variant.product_id !== item.product_id) {
          throw new BadRequestException(
            `Variant ${item.variant_id} does not belong to Product ${item.product_id}`,
          );
        }

        // Validate stock
        if (!variant.stock || variant.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for variant ${variant.id}. Available: ${variant.stock || 0}, Requested: ${item.quantity}`,
          );
        }

        // Calculate price
        const itemTotal = (variant.price || 0) * item.quantity;
        totalOrderAmount += itemTotal;

        orderItemsData.push({
          product,
          variant,
          quantity: item.quantity,
          itemTotal,
        });
      }

      // Step 2: Create order
      const order = queryRunner.manager.create(Order, {
        user_id: user.id,
        total_amount: totalOrderAmount,
        status: 'pending',
      });

      const savedOrder = await queryRunner.manager.save(order);
      this.logger.log(`Order created with id ${savedOrder.id}`);

      // Step 3: Create order items and reduce stock (OPTIMIZED)
      const orderItems: OrderItem[] = [];
      for (const itemData of orderItemsData) {
        // Create order item
        const orderItem = queryRunner.manager.create(OrderItem, {
          order_id: savedOrder.id,
          product_id: itemData.product.id,
          variant_id: itemData.variant.id,
          quantity: itemData.quantity,
          price: itemData.variant.price,
        });

        const savedItem = await queryRunner.manager.save(orderItem);
        orderItems.push(savedItem);

        // OPTIMIZATION: Use direct SQL UPDATE instead of fetch-modify-save
        await queryRunner.manager.update(
          Variant,
          { id: itemData.variant.id },
          { stock: () => `stock - ${itemData.quantity}` },
        );

        this.logger.log(
          `Order item created: Product ${itemData.product.id} > Variant ${itemData.variant.id}, qty ${itemData.quantity}`,
        );
      }

      // Step 4: Commit transaction
      await queryRunner.commitTransaction();
      this.logger.log(`Order ${savedOrder.id} committed successfully`);

      // OPTIMIZATION: Build response without extra database fetch
      const completedOrder = new Order();
      completedOrder.id = savedOrder.id;
      completedOrder.user_id = user.id;
      completedOrder.total_amount = totalOrderAmount;
      completedOrder.status = 'pending';
      completedOrder.created_at = savedOrder.created_at;
      completedOrder.items = orderItems.map((item, idx) => ({
        ...item,
        product: orderItemsData[idx].product,
        variant: orderItemsData[idx].variant,
      }));

      return completedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create order: ${errorMessage}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
