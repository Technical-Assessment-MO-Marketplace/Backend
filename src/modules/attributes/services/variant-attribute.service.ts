import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VariantAttribute } from '../../variants/entities/variant-attribute.entity';
import { CreateVariantAttributeDto } from '../dto/create-variant-attribute.dto';
import { AttributeValue } from '../entities/attribute-value.entity';
import { Variant } from '../../variants/entities/variant.entity';

@Injectable()
export class VariantAttributeService {
  private readonly logger = new Logger(VariantAttributeService.name);

  constructor(
    @InjectRepository(VariantAttribute)
    private variantAttributeRepository: Repository<VariantAttribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  async create(
    createVariantAttributeDto: CreateVariantAttributeDto,
  ): Promise<VariantAttribute> {
    try {
      const { variant_id, attribute_value_id } = createVariantAttributeDto;

      // Verify variant exists
      const variant = await this.variantRepository.findOne({
        where: { id: variant_id },
      });

      if (!variant) {
        throw new NotFoundException(`Variant with id ${variant_id} not found`);
      }

      // Verify attribute value exists
      const attributeValue = await this.attributeValueRepository.findOne({
        where: { id: attribute_value_id },
      });

      if (!attributeValue) {
        throw new NotFoundException(
          `Attribute value with id ${attribute_value_id} not found`,
        );
      }

      // Check if combination already exists
      const existing = await this.variantAttributeRepository.findOne({
        where: { variant_id, attribute_value_id },
      });

      if (existing) {
        throw new BadRequestException(
          'This variant-attribute combination already exists',
        );
      }

      // Create new variant attribute
      const variantAttribute = this.variantAttributeRepository.create({
        variant_id,
        attribute_value_id,
      });

      const saved =
        await this.variantAttributeRepository.save(variantAttribute);
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
      const attributes = await this.variantAttributeRepository.find({
        where: { variant_id },
        relations: ['attributeValue', 'attributeValue.attribute'],
      });
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
      const attributes = await this.variantAttributeRepository.find({
        relations: ['variant', 'attributeValue', 'attributeValue.attribute'],
      });
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
