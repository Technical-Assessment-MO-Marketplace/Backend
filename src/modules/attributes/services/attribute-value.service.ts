import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AttributeValue } from '../entities/attribute-value.entity';
import { CreateAttributeValueDto } from '../dto/create-attribute-value.dto';
import { AttributeValueRepository } from '../repositories/attribute-value.repository';
import { AttributeRepository } from '../repositories/attribute.repository';

@Injectable()
export class AttributeValueService {
  private readonly logger = new Logger(AttributeValueService.name);

  constructor(
    private attributeValueRepository: AttributeValueRepository,
    private attributeRepository: AttributeRepository,
  ) {}

  async create(
    createAttributeValueDto: CreateAttributeValueDto,
  ): Promise<AttributeValue> {
    try {
      const { attribute_id, value } = createAttributeValueDto;

      // Verify attribute exists
      const attribute = await this.attributeRepository.findById(attribute_id);

      if (!attribute) {
        throw new NotFoundException(
          `Attribute with id ${attribute_id} not found`,
        );
      }

      // Check if value already exists for this attribute
      const existingValue =
        await this.attributeValueRepository.findByAttributeAndValue(
          attribute_id,
          value,
        );

      if (existingValue) {
        throw new BadRequestException(
          `Value "${value}" already exists for this attribute`,
        );
      }

      // Create new attribute value
      const savedValue = await this.attributeValueRepository.create({
        attribute_id,
        value,
      });
      this.logger.log(
        `Attribute value created: ${value} for attribute ${attribute_id}`,
      );
      return savedValue;
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create attribute value: ${message}`);
      throw new InternalServerErrorException(
        'Failed to create attribute value',
      );
    }
  }

  async findByAttribute(attribute_id: number): Promise<AttributeValue[]> {
    try {
      const values =
        await this.attributeValueRepository.findByAttribute(attribute_id);
      return values;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch attribute values: ${message}`);
      throw new InternalServerErrorException(
        'Failed to fetch attribute values',
      );
    }
  }

  async findAll(): Promise<AttributeValue[]> {
    try {
      const values = await this.attributeValueRepository.findAll();
      return values;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch attribute values: ${message}`);
      throw new InternalServerErrorException(
        'Failed to fetch attribute values',
      );
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const attributeValue = await this.attributeValueRepository.findById(id);

      if (!attributeValue) {
        throw new NotFoundException(`Attribute value with id ${id} not found`);
      }

      // Delete the attribute value
      await this.attributeValueRepository.delete(id);

      this.logger.log(`Attribute value deleted: id ${id}`);
      return { message: 'Attribute value deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete attribute value: ${message}`);
      throw new InternalServerErrorException(
        'Failed to delete attribute value',
      );
    }
  }
}
