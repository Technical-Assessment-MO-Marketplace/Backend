import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttributeValue } from '../entities/attribute-value.entity';

@Injectable()
export class AttributeValueRepository {
  constructor(
    @InjectRepository(AttributeValue)
    private repository: Repository<AttributeValue>,
  ) {}

  async create(data: {
    attribute_id: number;
    value: string;
  }): Promise<AttributeValue> {
    const attributeValue = this.repository.create(data);
    return this.repository.save(attributeValue);
  }

  async findAll(): Promise<AttributeValue[]> {
    return this.repository.find({
      relations: ['attribute'],
    });
  }

  async findById(id: number): Promise<AttributeValue | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['attribute'],
    });
  }

  async findByAttribute(attribute_id: number): Promise<AttributeValue[]> {
    return this.repository.find({
      where: { attribute_id },
    });
  }

  async findByAttributeAndValue(
    attribute_id: number,
    value: string,
  ): Promise<AttributeValue | null> {
    return this.repository.findOne({
      where: { attribute_id, value },
    });
  }

  async delete(id: number): Promise<void> {
    const attributeValue = await this.repository.findOne({
      where: { id },
    });
    if (attributeValue) {
      await this.repository.remove(attributeValue);
    }
  }
}
