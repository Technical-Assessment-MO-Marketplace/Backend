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
import { VariantAttribute } from '../../variants/entities/variant-attribute.entity';
import { AttributeValue } from '../../attributes/entities/attribute-value.entity';
import { Attribute } from '../../attributes/entities/attribute.entity';

@Injectable()
export class VariantService {
  private readonly logger = new Logger(VariantService.name);

  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(VariantAttribute)
    private variantAttributeRepository: Repository<VariantAttribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
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

      // ============ CREATE VARIANT ATTRIBUTES ============

      // Create VariantAttribute records to link variant with attribute values
      for (const attributeValueId of createVariantDto.attributeValueIds) {
        const variantAttribute = this.variantAttributeRepository.create({
          variant_id: savedVariant.id,
          attribute_value_id: attributeValueId,
        });
        await this.variantAttributeRepository.save(variantAttribute);
      }

      this.logger.log(
        `Variant created successfully - ID: ${savedVariant.id}, Product: ${createVariantDto.product_id}, Combination: ${combinationKey}, Price: ${createVariantDto.price}, Stock: ${createVariantDto.stock}`,
      );

      return savedVariant;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create variant: ${message}`);
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

      // Transform variants to include attribute values instead of combination_key
      const enrichedVariants = await Promise.all(
        variants.map(async (variant) => {
          const variantAttributes = await this.variantAttributeRepository.find({
            where: { variant_id: variant.id },
          });

          const attributeValues: string[] = [];
          
          // Sort variant attributes by attribute_value_id for consistency
          const sortedAttributes = variantAttributes.sort(
            (a, b) => (a.attribute_value_id || 0) - (b.attribute_value_id || 0),
          );

          for (const variantAttr of sortedAttributes) {
            const attrValue = await this.attributeValueRepository.findOne({
              where: { id: variantAttr.attribute_value_id },
            });
            if (attrValue && attrValue.value) {
              attributeValues.push(attrValue.value);
            }
          }

          return {
            id: variant.id,
            product_id: variant.product_id,
            attributes: attributeValues.join(', '),
            price: variant.price,
            stock: variant.stock,
            created_at: variant.created_at,
          };
        }),
      );

      return enrichedVariants;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch variants: ${message}`);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch variant: ${message}`);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to update stock: ${message}`);
      throw error;
    }
  }

  async deleteVariant(id: number): Promise<void> {
    try {
      this.logger.log(`Deleting variant ${id}`);

      const variant = await this.findOne(id);
      await this.variantRepository.remove(variant);
      this.logger.log(`Variant ${id} deleted successfully`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete variant: ${message}`);
      throw error;
    }
  }

  async getProductAttributes(productId: number): Promise<any[]> {
    try {
      this.logger.log(`Fetching attributes for product ${productId}`);

      // Verify product exists
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      // Get all variants for this product
      const variants = await this.variantRepository.find({
        where: { product_id: productId },
      });

      if (variants.length === 0) {
        return [];
      }

      // Get all variant attributes from all variants
      const allVariantAttributes: { attribute_id?: number; [key: string]: any }[] = [];

      for (const variant of variants) {
        const variantAttributes = await this.variantAttributeRepository.find({
          where: { variant_id: variant.id },
        });
        allVariantAttributes.push(...variantAttributes);
      }

      // Get unique attribute IDs
      const uniqueAttributeIds = [...new Set(allVariantAttributes.map((va) => {
        // We need to get the attribute_id from the attribute_value
        return va.attribute_value_id;
      }))];

      // Get all unique attributes and their values for those attributes
      const attributes: any[] = [];
      const processedAttributeIds = new Set<number>();

      for (const attributeValueId of uniqueAttributeIds) {
        const attributeValue = await this.attributeValueRepository.findOne({
          where: { id: attributeValueId },
        });

        if (attributeValue && attributeValue.attribute_id && !processedAttributeIds.has(attributeValue.attribute_id)) {
          processedAttributeIds.add(attributeValue.attribute_id);

          // Get all values for this attribute
          const allValues = await this.attributeValueRepository.find({
            where: { attribute_id: attributeValue.attribute_id },
          });

          // Get the attribute name
          const attribute = await this.attributeRepository.findOne({
            where: { id: attributeValue.attribute_id },
          });

          attributes.push({
            attribute_id: attributeValue.attribute_id,
            attribute_name: attribute?.name || '',
            values: allValues.map((v) => ({
              id: v.id,
              value: v.value,
            })),
          });
        }
      }

      this.logger.log(`Found ${attributes.length} attributes for product ${productId}`);
      return attributes;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch product attributes: ${message}`);
      throw new BadRequestException('Failed to fetch product attributes');
    }
  }
}
