import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
import { CreateProductDto, CreateVariantDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Products-Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin/products')
@UseGuards(JwtGuard, AdminGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private productService: ProductService,
    private variantService: VariantService,
  ) {}

  // PRODUCT ENDPOINTS

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with name and description. Admin only.',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Product Name',
        description: 'Product Description',
        created_by: 1,
        message: 'Product created successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid product data',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ) {
    this.logger.log(
      `Creating product: ${createProductDto.name} by user ${req.user.userId}`,
    );
    const product = await this.productService.create(
      createProductDto,
      req.user.userId,
    );
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      created_by: product.created_by,
      message: 'Product created successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update product name and/or description. Admin only.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      partial: {
        value: { name: 'Updated Name' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async updateProduct(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateProductDto>,
  ) {
    this.logger.log(`Updating product ${id}`);
    const product = await this.productService.update(id, updateData);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      message: 'Product updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete a product and all its variants. Admin only.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async deleteProduct(@Param('id') id: number) {
    this.logger.log(`Deleting product ${id}`);
    await this.productService.remove(id);
    return {
      message: 'Product deleted successfully',
    };
  }

  // VARIANT ENDPOINTS

  @Post(':productId/variants')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create product variant',
    description:
      'Create a new variant for a product with specific attributes, price, and stock. Admin only.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
  })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({
    status: 201,
    description: 'Variant created successfully',
    schema: {
      example: {
        id: 1,
        product_id: 1,
        price: 99.99,
        stock: 100,
        combination_key: 'red-M-cotton',
        message: 'Variant created successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid variant data or duplicate combination',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async createVariant(
    @Param('productId') productId: number,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    this.logger.log(`Creating variant for product ${productId}`);
    const variant = await this.variantService.createVariant({
      ...createVariantDto,
      product_id: productId,
    });
    return {
      id: variant.id,
      product_id: variant.product_id,
      price: variant.price,
      stock: variant.stock,
      combination_key: variant.combination_key,
      message: 'Variant created successfully',
    };
  }

  @Patch(':productId/variants/:variantId')
  @ApiOperation({
    summary: 'Update variant',
    description: 'Update variant stock level. Admin only.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: Number,
    description: 'Variant ID',
  })
  @ApiBody({
    schema: {
      example: { stock: 50 },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Variant updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Variant or Product not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async updateVariant(
    @Param('productId') productId: number,
    @Param('variantId') variantId: number,
    @Body() updateData: Partial<CreateVariantDto>,
  ) {
    this.logger.log(`Updating variant ${variantId} for product ${productId}`);
    const variant = await this.variantService.updateStock(
      variantId,
      updateData.stock || 0,
    );
    return {
      id: variant?.id,
      product_id: variant?.product_id,
      price: variant?.price,
      stock: variant?.stock,
      message: 'Variant updated successfully',
    };
  }

  @Delete(':productId/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete variant',
    description: 'Delete a variant from a product. Admin only.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: Number,
    description: 'Variant ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Variant deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Variant or Product not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async deleteVariant(
    @Param('productId') productId: number,
    @Param('variantId') variantId: number,
  ) {
    this.logger.log(`Deleting variant ${variantId} from product ${productId}`);
    await this.variantService.deleteVariant(variantId);
    return {
      message: 'Variant deleted successfully',
    };
  }
}
