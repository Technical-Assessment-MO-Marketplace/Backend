import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant, VariantAttribute } from '../entities';
import { AttributeValue } from '../../attributes/entities/attribute-value.entity';
import { Attribute } from '../../attributes/entities/attribute.entity';
import { VariantRepository, ProductRepository } from '../repositories';

@Injectable()
export class VariantService {
  private readonly logger = new Logger(VariantService.name);

  constructor(
    private variantRepository: VariantRepository,
    private productRepository: ProductRepository,
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

      // Check if product exists
      const product = await this.productRepository.findById(
        createVariantDto.product_id,
      );

      if (!product) {
        throw new NotFoundException(
          `Product with id ${createVariantDto.product_id} not found`,
        );
      }

      // Create combination key from attribute values (human-readable format like "red-M-cotton")
      const attributeValues = await Promise.all(
        createVariantDto.attributeValueIds.map(async (id) => {
          const attrValue = await this.attributeValueRepository.findOne({
            where: { id },
          });
          return attrValue?.value || '';
        }),
      );

      // Sort attribute values alphabetically for consistency
      const sortedAttributeValues = attributeValues.sort();
      const combinationKey = sortedAttributeValues.join('-');

      this.logger.log(
        `Creating combination key: ${combinationKey} for attributes: [${attributeValues.join(', ')}]`,
      );

      // Check if variant with this exact combination already exists
      const existingVariant =
        await this.variantRepository.findByProductAndCombinationKey(
          createVariantDto.product_id,
          combinationKey,
        );

      if (existingVariant) {
        this.logger.warn(
          `Duplicate variant attempted for product ${createVariantDto.product_id}`,
        );
        throw new BadRequestException(
          `A variant with this attribute combination already exists for this product`,
        );
      }

      // Create variant
      const savedVariant = await this.variantRepository.create({
        product_id: createVariantDto.product_id,
        combination_key: combinationKey,
        price: createVariantDto.price,
        stock: createVariantDto.stock,
      });

      // Create VariantAttribute records
      for (const attributeValueId of createVariantDto.attributeValueIds) {
        const variantAttribute = this.variantAttributeRepository.create({
          variant_id: savedVariant.id,
          attribute_value_id: attributeValueId,
        });
        await this.variantAttributeRepository.save(variantAttribute);
      }

      this.logger.log(`Variant created successfully - ID: ${savedVariant.id}`);

      return savedVariant;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create variant: ${message}`);
      throw error;
    }
  }

  async findAllVariants(productId?: number): Promise<any[]> {
    try {
      let variants: Variant[];

      if (productId) {
        variants = await this.variantRepository.findByProductId(productId);
        this.logger.log(`Fetching variants for product ${productId}`);
      } else {
        variants = await this.variantRepository.findAll();
        this.logger.log('Fetching all variants');
      }

      const enrichedVariants = await Promise.all(
        variants.map(async (variant) => {
          const variantAttributes = await this.variantAttributeRepository.find({
            where: { variant_id: variant.id },
          });

          const attributeValues: string[] = [];

          for (const variantAttr of variantAttributes) {
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

  async findOne(id: number): Promise<Variant> {
    try {
      this.logger.log(`Fetching variant ${id}`);
      const variant = await this.variantRepository.findById(id);

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

  async updateStock(id: number, newStock: number): Promise<Variant> {
    try {
      this.logger.log(`Updating stock for variant ${id} to ${newStock}`);

      const variant = await this.findOne(id);

      if (!variant) {
        throw new NotFoundException(`Variant with id ${id} not found`);
      }

      const updated = await this.variantRepository.update(id, {
        stock: newStock,
      });

      if (!updated) {
        throw new Error('Failed to update variant stock');
      }

      this.logger.log(`Variant ${id} stock updated successfully`);
      return updated;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to update variant stock: ${message}`);
      throw error;
    }
  }

  async deleteVariant(id: number): Promise<void> {
    try {
      this.logger.log(`Deleting variant ${id}`);

      const variant = await this.findOne(id);
      await this.variantRepository.delete(id);

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
      const product = await this.productRepository.findById(productId);

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      // Get all variants for this product
      const variants = await this.variantRepository.findByProductId(productId);

      if (variants.length === 0) {
        return [];
      }

      // Get all variant attributes from all variants
      const allVariantAttributes: any[] = [];

      for (const variant of variants) {
        const variantAttributes = await this.variantAttributeRepository.find({
          where: { variant_id: variant.id },
        });
        allVariantAttributes.push(...variantAttributes);
      }

      // Get unique attribute value IDs
      const uniqueAttributeValueIds = [
        ...new Set(allVariantAttributes.map((va) => va.attribute_value_id)),
      ];

      // Get all unique attributes and their values
      const attributes: any[] = [];
      const processedAttributeIds = new Set<number>();

      for (const attributeValueId of uniqueAttributeValueIds) {
        const attributeValue = await this.attributeValueRepository.findOne({
          where: { id: attributeValueId },
        });

        if (
          attributeValue &&
          attributeValue.attribute_id &&
          !processedAttributeIds.has(attributeValue.attribute_id)
        ) {
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

      this.logger.log(
        `Found ${attributes.length} attributes for product ${productId}`,
      );
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

  async filterVariantsByAttributes(
    productId: number,
    attributeValueIds: number[],
  ): Promise<any[]> {
    try {
      if (!attributeValueIds || attributeValueIds.length === 0) {
        throw new BadRequestException(
          'At least one attribute value must be provided for filtering',
        );
      }

      this.logger.log(
        `Filtering variants for product ${productId} with attributes: [${attributeValueIds.join(', ')}]`,
      );

      // Verify product exists
      const product = await this.productRepository.findById(productId);

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      // Get all variants for this product
      const variants = await this.variantRepository.findByProductId(productId);

      if (variants.length === 0) {
        return [];
      }

      // Filter variants that have ALL selected attribute values
      const filteredVariants: any[] = [];

      for (const variant of variants) {
        const variantAttributes = await this.variantAttributeRepository.find({
          where: { variant_id: variant.id },
        });

        const variantAttributeValueIds = variantAttributes.map(
          (va) => va.attribute_value_id,
        );

        // Check if variant has all selected attribute values
        const hasAllAttributes = attributeValueIds.every((attrValueId) =>
          variantAttributeValueIds.includes(attrValueId),
        );

        if (hasAllAttributes) {
          // Get detailed info for this variant
          const enrichedVariant = await this.enrichVariantWithDetails(
            variant,
            variantAttributes,
          );
          filteredVariants.push(enrichedVariant);
        }
      }

      this.logger.log(
        `Found ${filteredVariants.length} variants matching the selected attributes`,
      );
      return filteredVariants;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to filter variants: ${message}`);
      throw new BadRequestException('Failed to filter variants');
    }
  }

  private async enrichVariantWithDetails(
    variant: Variant,
    variantAttributes: VariantAttribute[],
  ): Promise<any> {
    const attributeDetails: any[] = [];

    for (const variantAttr of variantAttributes) {
      const attributeValue = await this.attributeValueRepository.findOne({
        where: { id: variantAttr.attribute_value_id },
      });

      if (attributeValue) {
        const attribute = await this.attributeRepository.findOne({
          where: { id: attributeValue.attribute_id },
        });

        attributeDetails.push({
          attribute_name: attribute?.name || '',
          attribute_value: attributeValue.value,
          attribute_value_id: attributeValue.id,
        });
      }
    }

    return {
      id: variant.id,
      product_id: variant.product_id,
      combination_key: variant.combination_key,
      price: variant.price,
      stock: variant.stock,
      created_at: variant.created_at,
      attributes: attributeDetails,
    };
  }
}
