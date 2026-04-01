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
import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
import { CreateProductDto, CreateVariantDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

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
  async deleteProduct(@Param('id') id: number) {
    this.logger.log(`Deleting product ${id}`);
    await this.productService.remove(id);
    return {
      message: 'Product deleted successfully',
    };
  }

  //  VARIANT ENDPOINTS

  @Post('variants')
  @HttpCode(HttpStatus.CREATED)
  async createVariant(@Body() createVariantDto: CreateVariantDto) {
    this.logger.log(
      `Creating variant for product ${createVariantDto.product_id}`,
    );
    const variant = await this.variantService.createVariant(createVariantDto);
    return {
      id: variant.id,
      product_id: variant.product_id,
      combination_key: variant.combination_key,
      price: variant.price,
      stock: variant.stock,
      message: 'Variant created successfully',
    };
  }

  @Patch('variant/:id/stock')
  async updateVariantStock(
    @Param('id') id: number,
    @Body() updateData: { stock: number },
  ) {
    this.logger.log(`Updating stock for variant ${id}`);
    const variant = await this.variantService.updateStock(id, updateData.stock);
    return {
      id: variant.id,
      stock: variant.stock,
      message: 'Variant stock updated successfully',
    };
  }

  @Delete('variant/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVariant(@Param('id') id: number) {
    this.logger.log(`Deleting variant ${id}`);
    await this.variantService.deleteVariant(id);
    return {
      message: 'Variant deleted successfully',
    };
  }
}
