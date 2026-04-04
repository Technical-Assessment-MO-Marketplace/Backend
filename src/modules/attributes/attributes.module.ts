import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { AttributeService, AttributeValueService } from './services';
import { AttributeRepository, AttributeValueRepository } from './repositories';
import { AttributesController } from './controllers/attributes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute, AttributeValue])],
  controllers: [AttributesController],
  providers: [
    AttributeService,
    AttributeValueService,
    AttributeRepository,
    AttributeValueRepository,
  ],
  exports: [
    AttributeService,
    AttributeValueService,
    AttributeRepository,
    AttributeValueRepository,
  ],
})
export class AttributesModule {}
