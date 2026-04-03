import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';
import { CreateAttributeDto } from '../dto/create-attribute.dto';

@Injectable()
export class AttributeService {
  private readonly logger = new Logger(AttributeService.name);

  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    try {
      const { name } = createAttributeDto;

      // Check if attribute already exists
      const existingAttribute = await this.attributeRepository.findOne({
        where: { name },
      });

      if (existingAttribute) {
        throw new BadRequestException(`Attribute "${name}" already exists`);
      }

      // Create new attribute
      const attribute = this.attributeRepository.create({ name });
      const savedAttribute = await this.attributeRepository.save(attribute);

      this.logger.log(`Attribute created: ${name}`);
      return savedAttribute;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create attribute: ${message}`);
      throw new InternalServerErrorException('Failed to create attribute');
    }
  }

  async findAll(): Promise<Attribute[]> {
    try {
      const attributes = await this.attributeRepository.find({
        relations: ['attributeValues'],
      });
      return attributes;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch attributes: ${message}`);
      throw new InternalServerErrorException('Failed to fetch attributes');
    }
  }

  async findById(id: number): Promise<Attribute> {
    try {
      const attribute = await this.attributeRepository.findOne({
        where: { id },
        relations: ['attributeValues'],
      });

      if (!attribute) {
        throw new NotFoundException(`Attribute with id ${id} not found`);
      }

      return attribute;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch attribute: ${message}`);
      throw new InternalServerErrorException('Failed to fetch attribute');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const attribute = await this.attributeRepository.findOne({
        where: { id },
      });

      if (!attribute) {
        throw new NotFoundException(`Attribute with id ${id} not found`);
      }

      // Delete the attribute (cascade delete will remove all related attribute values)
      await this.attributeRepository.remove(attribute);

      this.logger.log(`Attribute deleted: id ${id}`);
      return { message: 'Attribute deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete attribute: ${message}`);
      throw new InternalServerErrorException('Failed to delete attribute');
    }
  }
}
