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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, OrderResponseDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Get all orders',
    description:
      'Retrieve all orders with full details including order items, products, and variants. Authenticated users only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Orders retrieved successfully',
        data: [
          {
            id: 1,
            user: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
            },
            total_amount: 149.97,
            status: 'pending',
            items: [
              {
                id: 1,
                product: { id: 1, name: 'T-Shirt' },
                variant: {
                  id: 1,
                  price: 29.99,
                  stock: 50,
                },
                quantity: 5,
                price: 29.99,
              },
            ],
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
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
  @ApiOperation({
    summary: 'Create order',
    description:
      'Create a new order with one or more items. Authenticated users only. Validates product availability, variant existence, and stock levels.',
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      example1: {
        value: {
          items: [
            { product_id: 1, variant_id: 1, quantity: 2 },
            { product_id: 2, variant_id: 3, quantity: 1 },
          ],
        },
        description: 'Create order with multiple items',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Order created successfully',
        data: {
          id: 1,
          user_id: 1,
          total_amount: 149.97,
          status: 'pending',
          items: [
            {
              id: 1,
              order_id: 1,
              product_id: 1,
              variant_id: 1,
              quantity: 2,
              price: 29.99,
              product: { id: 1, name: 'T-Shirt' },
              variant: { id: 1, price: 29.99, stock: 48 },
            },
          ],
          created_at: '2024-01-01T00:00:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid order data - empty items, duplicate combinations, insufficient stock, or invalid variants',
    schema: {
      examples: {
        emptyItems: {
          value: {
            statusCode: 400,
            message: 'Order must contain at least one item',
          },
        },
        insufficientStock: {
          value: {
            statusCode: 400,
            message:
              'Not enough stock for variant 1. Available: 10, Requested: 20',
          },
        },
        invalidVariant: {
          value: {
            statusCode: 404,
            message: 'Variant with id 999 not found',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during order creation',
  })
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
