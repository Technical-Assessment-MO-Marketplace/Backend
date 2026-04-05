import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';

@Injectable()
export class AttributeRepository {
  constructor(
    @InjectRepository(Attribute)
    private repository: Repository<Attribute>,
  ) {}

  async create(data: { name: string }): Promise<Attribute> {
    const attribute = this.repository.create(data);
    return this.repository.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return this.repository.find({
      relations: ['attributeValues'],
    });
  }

  async findById(id: number): Promise<Attribute | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['attributeValues'],
    });
  }

  async findByName(name: string): Promise<Attribute | null> {
    return this.repository.findOne({
      where: { name },
    });
  }

  async delete(id: number): Promise<void> {
    const attribute = await this.repository.findOne({
      where: { id },
    });
    if (attribute) {
      await this.repository.remove(attribute);
    }
  }
}
