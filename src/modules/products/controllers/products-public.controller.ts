import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
import { FilterVariantDto } from '../dto';

@ApiTags('Products-Public')
@Controller('products')
export class ProductsPublicController {
  private readonly logger = new Logger(ProductsPublicController.name);

  constructor(
    private productService: ProductService,
    private variantService: VariantService,
  ) {}

  // PUBLIC PRODUCT ENDPOINTS - Accessible to all users (no authentication required)

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all available products. No authentication required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: {
        products: [
          {
            id: 1,
            name: 'T-Shirt',
            description: 'Comfortable cotton t-shirt',
            created_by: 1,
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        total: 1,
        message: 'Products retrieved successfully',
      },
    },
  })
  async getAllProducts() {
    this.logger.log('Fetching all products (public access)');
    const products = await this.productService.findAll();
    return {
      products,
      total: products.length,
      message: 'Products retrieved successfully',
    };
  }

  @Get(':productId/variants')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get product variants',
    description:
      'Retrieve all available variants for a specific product. No authentication required.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product variants retrieved successfully',
    schema: {
      example: {
        productId: 1,
        variants: [
          {
            id: 1,
            product_id: 1,
            attributes: 'red, M, cotton',
            price: 29.99,
            stock: 50,
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        total: 1,
        message: 'Product variants retrieved successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async getProductVariants(@Param('productId') productId: number) {
    this.logger.log(
      `Fetching variants for product ${productId} (public access)`,
    );
    const variants = await this.variantService.findAllVariants(productId);
    return {
      productId,
      variants,
      total: variants.length,
      message: 'Product variants retrieved successfully',
    };
  }

  @Get(':productId/attributes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get product attributes',
    description:
      'Retrieve all attributes available for filtering a product variants. No authentication required.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product attributes retrieved successfully',
    schema: {
      example: {
        productId: 1,
        attributes: [
          {
            attribute_id: 1,
            attribute_name: 'Color',
            values: [
              { id: 1, value: 'Red' },
              { id: 2, value: 'Blue' },
            ],
          },
          {
            attribute_id: 2,
            attribute_name: 'Size',
            values: [
              { id: 3, value: 'Small' },
              { id: 4, value: 'Medium' },
            ],
          },
        ],
        total: 2,
        message: 'Product attributes retrieved successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async getProductAttributes(@Param('productId') productId: number) {
    this.logger.log(
      `Fetching attributes for product ${productId} (public access)`,
    );
    const attributes =
      await this.variantService.getProductAttributes(productId);
    return {
      productId,
      attributes,
      total: attributes.length,
      message: 'Product attributes retrieved successfully',
    };
  }

  @Post(':productId/variants/filter')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filter product variants',
    description:
      'Filter variants by selected attribute values. Returns matching variants. No authentication required.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
  })
  @ApiBody({
    type: FilterVariantDto,
    examples: {
      example1: {
        value: { attributeValueIds: [1, 3] },
        description: 'Filter by Color (Red) and Size (Medium)',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered variants retrieved successfully',
    schema: {
      example: {
        productId: 1,
        variants: [
          {
            id: 1,
            product_id: 1,
            price: 29.99,
            stock: 50,
            attributes: [
              { attribute_name: 'Color', attribute_value: 'Red' },
              { attribute_name: 'Size', attribute_value: 'Medium' },
            ],
          },
        ],
        total: 1,
        message: 'Filtered variants retrieved successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid filter parameters',
    schema: {
      example: {
        statusCode: 400,
        message: 'Please select at least one filter option',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async filterVariants(
    @Param('productId') productId: number,
    @Body() filterVariantDto: FilterVariantDto,
  ) {
    try {
      this.logger.log(
        `Filtering variants for product ${productId} with attributes: [${filterVariantDto.attributeValueIds.join(', ')}]`,
      );

      const variants = await this.variantService.filterVariantsByAttributes(
        productId,
        filterVariantDto.attributeValueIds,
      );

      return {
        productId,
        variants,
        total: variants.length,
        message:
          variants.length > 0
            ? 'Filtered variants retrieved successfully'
            : 'No variants found matching your filters',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to filter variants';
      this.logger.error(
        `Filtering failed for product ${productId}: ${message}`,
      );
      throw error;
    }
  }
}
