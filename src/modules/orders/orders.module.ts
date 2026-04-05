import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities';
import { OrderService } from './services';
import { OrderController } from './controllers';
import { OrderRepository, OrderItemRepository } from './repositories';
import { Variant } from '../products/entities/variant.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Variant, Product])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderItemRepository],
  exports: [OrderService, OrderRepository, OrderItemRepository],
})
export class OrdersModule {}
