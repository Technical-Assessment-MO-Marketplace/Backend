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
import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
import { FilterVariantDto } from '../dto';

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
