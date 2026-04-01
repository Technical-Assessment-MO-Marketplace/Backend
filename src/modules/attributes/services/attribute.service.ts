import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';
import { CreateAttributeDto } from '../dto/create-attribute.dto';

@Injectable()
export class AttributeService {
  private attributeRepository: Repository<Attribute>;
  private readonly logger = new Logger(AttributeService.name);

  constructor(private dataSource: DataSource) {
    this.attributeRepository = this.dataSource.getRepository(Attribute);
  }

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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to create attribute: ${error.message}`);
      throw new InternalServerErrorException('Failed to create attribute');
    }
  }

  async findAll(): Promise<Attribute[]> {
    try {
      const attributes = await this.attributeRepository.find({
        relations: ['attributeValues'],
      });
      return attributes;
    } catch (error) {
      this.logger.error(`Failed to fetch attributes: ${error.message}`);
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch attribute: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch attribute');
    }
  }
}
