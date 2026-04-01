import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AttributeValue } from '../entities/attribute-value.entity';
import { CreateAttributeValueDto } from '../dto/create-attribute-value.dto';
import { Attribute } from '../entities/attribute.entity';

@Injectable()
export class AttributeValueService {
  private attributeValueRepository: Repository<AttributeValue>;
  private attributeRepository: Repository<Attribute>;
  private readonly logger = new Logger(AttributeValueService.name);

  constructor(private dataSource: DataSource) {
    this.attributeValueRepository =
      this.dataSource.getRepository(AttributeValue);
    this.attributeRepository = this.dataSource.getRepository(Attribute);
  }

  async create(
    createAttributeValueDto: CreateAttributeValueDto,
  ): Promise<AttributeValue> {
    try {
      const { attribute_id, value } = createAttributeValueDto;

      // Verify attribute exists
      const attribute = await this.attributeRepository.findOne({
        where: { id: attribute_id },
      });

      if (!attribute) {
        throw new NotFoundException(
          `Attribute with id ${attribute_id} not found`,
        );
      }

      // Check if value already exists for this attribute
      const existingValue = await this.attributeValueRepository.findOne({
        where: { attribute_id, value },
      });

      if (existingValue) {
        throw new BadRequestException(
          `Value "${value}" already exists for this attribute`,
        );
      }

      // Create new attribute value
      const attributeValue = this.attributeValueRepository.create({
        attribute_id,
        value,
      });

      const savedValue =
        await this.attributeValueRepository.save(attributeValue);
      this.logger.log(
        `Attribute value created: ${value} for attribute ${attribute_id}`,
      );
      return savedValue;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(`Failed to create attribute value: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to create attribute value',
      );
    }
  }

  async findByAttribute(attribute_id: number): Promise<AttributeValue[]> {
    try {
      const values = await this.attributeValueRepository.find({
        where: { attribute_id },
      });
      return values;
    } catch (error) {
      this.logger.error(`Failed to fetch attribute values: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to fetch attribute values',
      );
    }
  }

  async findAll(): Promise<AttributeValue[]> {
    try {
      const values = await this.attributeValueRepository.find({
        relations: ['attribute'],
      });
      return values;
    } catch (error) {
      this.logger.error(`Failed to fetch attribute values: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to fetch attribute values',
      );
    }
  }
}
