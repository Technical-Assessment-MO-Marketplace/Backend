import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { VariantAttribute } from '../../variants/entities/variant-attribute.entity';
import { CreateVariantAttributeDto } from '../dto/create-variant-attribute.dto';
import { VariantAttributeRepository } from '../repositories/variant-attribute.repository';
import { AttributeValueRepository } from '../repositories/attribute-value.repository';
import { VariantRepository } from '../repositories/variant.repository';

@Injectable()
export class VariantAttributeService {
  private readonly logger = new Logger(VariantAttributeService.name);

  constructor(
    private variantAttributeRepository: VariantAttributeRepository,
    private attributeValueRepository: AttributeValueRepository,
    private variantRepository: VariantRepository,
  ) {}

  async create(
    createVariantAttributeDto: CreateVariantAttributeDto,
  ): Promise<VariantAttribute> {
    try {
      const { variant_id, attribute_value_id } = createVariantAttributeDto;

      // Verify variant exists
      const variant = await this.variantRepository.findById(variant_id);

      if (!variant) {
        throw new NotFoundException(`Variant with id ${variant_id} not found`);
      }

      // Verify attribute value exists
      const attributeValue =
        await this.attributeValueRepository.findById(attribute_value_id);

      if (!attributeValue) {
        throw new NotFoundException(
          `Attribute value with id ${attribute_value_id} not found`,
        );
      }

      // Check if combination already exists
      const existing =
        await this.variantAttributeRepository.findByVariantAndAttributeValue(
          variant_id,
          attribute_value_id,
        );

      if (existing) {
        throw new BadRequestException(
          'This variant-attribute combination already exists',
        );
      }

      // Create new variant attribute
      const saved = await this.variantAttributeRepository.create({
        variant_id,
        attribute_value_id,
      });
      this.logger.log(`Variant attribute created for variant ${variant_id}`);
      return saved;
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create variant attribute: ${message}`);
      throw new InternalServerErrorException(
        'Failed to create variant attribute',
      );
    }
  }

  async findByVariant(variant_id: number): Promise<VariantAttribute[]> {
    try {
      const attributes =
        await this.variantAttributeRepository.findByVariant(variant_id);
      return attributes;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch variant attributes: ${message}`);
      throw new InternalServerErrorException(
        'Failed to fetch variant attributes',
      );
    }
  }

  async findAll(): Promise<VariantAttribute[]> {
    try {
      const attributes = await this.variantAttributeRepository.findAll();
      return attributes;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch variant attributes: ${message}`);
      throw new InternalServerErrorException(
        'Failed to fetch variant attributes',
      );
    }
  }
}
