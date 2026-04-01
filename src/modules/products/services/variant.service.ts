import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../entities/variant.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class VariantService {
  private readonly logger = new Logger(VariantService.name);

  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createVariant(createVariantDto: any): Promise<any> {
    try {
      this.logger.log(
        `Creating variant for product ${createVariantDto.product_id} with price ${createVariantDto.price} and stock ${createVariantDto.stock}`,
      );

      // Validate attributeValueIds
      if (
        !createVariantDto.attributeValueIds ||
        !Array.isArray(createVariantDto.attributeValueIds) ||
        createVariantDto.attributeValueIds.length === 0
      ) {
        throw new BadRequestException(
          'Variant must have at least one attribute value selected',
        );
      }

      // Validate attributeValueIds are valid numbers
      if (
        !createVariantDto.attributeValueIds.every(
          (id: any) => Number.isInteger(id) && id > 0,
        )
      ) {
        throw new BadRequestException(
          'All attribute value IDs must be positive integers',
        );
      }

      // Validate price
      if (
        createVariantDto.price === undefined ||
        createVariantDto.price === null ||
        createVariantDto.price < 0
      ) {
        throw new BadRequestException('Price must be a non-negative number');
      }

      // Validate stock
      if (
        createVariantDto.stock === undefined ||
        createVariantDto.stock === null ||
        !Number.isInteger(createVariantDto.stock) ||
        createVariantDto.stock < 0
      ) {
        throw new BadRequestException('Stock must be a non-negative integer');
      }

      // ============ PRODUCT VALIDATION ============

      // Check if product exists
      const product = await this.productRepository.findOne({
        where: { id: createVariantDto.product_id },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with id ${createVariantDto.product_id} not found`,
        );
      }

      // ============ DUPLICATE PREVENTION ============

      // Create combination key from attribute value IDs (sorted for consistency)
      // Sorting ensures [1,2] and [2,1] create the same key
      const combinationKey = createVariantDto.attributeValueIds
        .sort((a: number, b: number) => a - b)
        .join('-');

      this.logger.log(
        `Checking for duplicate variant with combination key: ${combinationKey} for product ${createVariantDto.product_id}`,
      );

      // Check if variant with this exact combination already exists
      const existingVariant = await this.variantRepository.findOne({
        where: {
          product_id: createVariantDto.product_id,
          combination_key: combinationKey,
        },
      });

      if (existingVariant) {
        this.logger.warn(
          `Duplicate variant attempted: Product ${createVariantDto.product_id}, Combination ${combinationKey}`,
        );
        throw new BadRequestException(
          `A variant with attribute combination [${createVariantDto.attributeValueIds.sort((a: number, b: number) => a - b).join(', ')}] already exists for this product (ID: ${existingVariant.id}). Cannot create duplicate.`,
        );
      }

      // ============ CREATE VARIANT ============

      const variant = this.variantRepository.create({
        product_id: createVariantDto.product_id,
        combination_key: combinationKey,
        price: createVariantDto.price,
        stock: createVariantDto.stock,
      });

      const savedVariant = await this.variantRepository.save(variant);
      this.logger.log(
        `Variant created successfully - ID: ${savedVariant.id}, Product: ${createVariantDto.product_id}, Combination: ${combinationKey}, Price: ${createVariantDto.price}, Stock: ${createVariantDto.stock}`,
      );

      return savedVariant;
    } catch (error) {
      this.logger.error(`Failed to create variant: ${error.message}`);
      throw error;
    }
  }

  async findAllVariants(productId?: number): Promise<any[]> {
    try {
      const query: any = {};
      if (productId) {
        query.where = { product_id: productId };
        this.logger.log(`Fetching variants for product ${productId}`);
      } else {
        this.logger.log('Fetching all variants');
      }

      const variants = await this.variantRepository.find(query);

      return variants;
    } catch (error) {
      this.logger.error(`Failed to fetch variants: ${error.message}`);
      throw new BadRequestException('Failed to fetch variants');
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      this.logger.log(`Fetching variant ${id}`);
      const variant = await this.variantRepository.findOne({
        where: { id },
      });

      if (!variant) {
        throw new NotFoundException(`Variant with id ${id} not found`);
      }

      return variant;
    } catch (error) {
      this.logger.error(`Failed to fetch variant: ${error.message}`);
      throw error;
    }
  }

  async updateStock(id: number, newStock: number): Promise<any> {
    try {
      this.logger.log(`Updating stock for variant ${id} to ${newStock}`);

      const variant = await this.findOne(id);
      variant.stock = newStock;

      const updated = await this.variantRepository.save(variant);
      this.logger.log(`Variant ${id} stock updated successfully`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update stock: ${error.message}`);
      throw error;
    }
  }

  async deleteVariant(id: number): Promise<void> {
    try {
      this.logger.log(`Deleting variant ${id}`);

      const variant = await this.findOne(id);
      await this.variantRepository.remove(variant);
      this.logger.log(`Variant ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete variant: ${error.message}`);
      throw error;
    }
  }
}
