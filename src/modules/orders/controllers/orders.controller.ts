import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}

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

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOrder(@Param('id') id: number, @Request() req) {
    try {
      this.logger.log(
        `GET /orders/:${id} - User ${req.user.userId} fetching order`,
      );

      const order = await this.orderService.getOrderById(id);

      // Verify user owns this order
      if (order.user_id !== req.user.userId && req.user.roleId !== 1) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You do not have permission to view this order',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Order fetched successfully',
        data: order,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch order: ${errorMessage}`);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  async getUserOrders(@Request() req) {
    try {
      this.logger.log(
        `GET /orders - User ${req.user.userId} fetching their orders`,
      );

      const orders = await this.orderService.getUserOrders(req.user.userId);

      return {
        statusCode: HttpStatus.OK,
        message: 'Orders fetched successfully',
        data: orders,
        count: orders.length,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch user orders: ${errorMessage}`);
      throw error;
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard)
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() body: { status: 'pending' | 'completed' | 'cancelled' | 'shipped' },
    @Request() req,
  ) {
    try {
      this.logger.log(
        `PATCH /orders/:${id}/status - User ${req.user.userId} updating order status`,
      );

      // Only admins can update order status
      if (req.user.roleId !== 1) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Only admins can update order status',
        };
      }

      const order = await this.orderService.updateOrderStatus(id, body.status);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order status updated successfully',
        data: order,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to update order status: ${errorMessage}`);
      throw error;
    }
  }
}
