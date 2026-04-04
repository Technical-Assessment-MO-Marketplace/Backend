import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VariantAttribute } from '../../variants/entities/variant-attribute.entity';

@Injectable()
export class VariantAttributeRepository {
  constructor(
    @InjectRepository(VariantAttribute)
    private repository: Repository<VariantAttribute>,
  ) {}

  async create(data: {
    variant_id: number;
    attribute_value_id: number;
  }): Promise<VariantAttribute> {
    const variantAttribute = this.repository.create(data);
    return this.repository.save(variantAttribute);
  }

  async findAll(): Promise<VariantAttribute[]> {
    return this.repository.find({
      relations: ['attributeValue', 'attributeValue.attribute'],
    });
  }

  async findById(id: number): Promise<VariantAttribute | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['attributeValue', 'attributeValue.attribute'],
    });
  }

  async findByVariant(variant_id: number): Promise<VariantAttribute[]> {
    return this.repository.find({
      where: { variant_id },
      relations: ['attributeValue', 'attributeValue.attribute'],
    });
  }

  async findByVariantAndAttributeValue(
    variant_id: number,
    attribute_value_id: number,
  ): Promise<VariantAttribute | null> {
    return this.repository.findOne({
      where: { variant_id, attribute_value_id },
    });
  }

  async delete(id: number): Promise<void> {
    const variantAttribute = await this.repository.findOne({
      where: { id },
    });
    if (variantAttribute) {
      await this.repository.remove(variantAttribute);
    }
  }
}
