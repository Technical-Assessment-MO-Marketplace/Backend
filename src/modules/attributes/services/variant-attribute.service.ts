import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VariantAttribute } from '../../variants/entities/variant-attribute.entity';
import { CreateVariantAttributeDto } from '../dto/create-variant-attribute.dto';
import { AttributeValue } from '../entities/attribute-value.entity';
import { Variant } from '../../variants/entities/variant.entity';

@Injectable()
export class VariantAttributeService {
  private variantAttributeRepository: Repository<VariantAttribute>;
  private attributeValueRepository: Repository<AttributeValue>;
  private variantRepository: Repository<Variant>;
  private readonly logger = new Logger(VariantAttributeService.name);

  constructor(private dataSource: DataSource) {
    this.variantAttributeRepository =
      this.dataSource.getRepository(VariantAttribute);
    this.attributeValueRepository =
      this.dataSource.getRepository(AttributeValue);
    this.variantRepository = this.dataSource.getRepository(Variant);
  }

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
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(`Failed to create variant attribute: ${error.message}`);
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
    } catch (error) {
      this.logger.error(`Failed to fetch variant attributes: ${error.message}`);
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
    } catch (error) {
      this.logger.error(`Failed to fetch variant attributes: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to fetch variant attributes',
      );
    }
  }
}
