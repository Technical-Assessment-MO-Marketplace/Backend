import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, OrderResponseDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllOrders() {
    try {
      this.logger.log('GET /orders - Fetching all orders with full details');

      const orders = await this.orderService.getAllOrders();

      return {
        statusCode: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch orders: ${errorMessage}`);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      const userId = req.user?.userId || req.user?.id;
      this.logger.log(
        `POST /orders - User ${userId} creating order with ${createOrderDto.items.length} items`,
      );

      const user = {
        id: userId,
        email: req.user?.email,
      } as any;

      const order = await this.orderService.createOrder(createOrderDto, user);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create order: ${errorMessage}`);
      throw error;
    }
  }
}
