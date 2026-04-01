import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { VariantAttribute } from '../variants/entities/variant-attribute.entity';
import { Variant } from '../variants/entities/variant.entity';
import {
  AttributeService,
  AttributeValueService,
  VariantAttributeService,
} from './services';
import { AttributesController } from './controllers/attributes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attribute,
      AttributeValue,
      VariantAttribute,
      Variant,
    ]),
  ],
  controllers: [AttributesController],
  providers: [AttributeService, AttributeValueService, VariantAttributeService],
  exports: [AttributeService, AttributeValueService, VariantAttributeService],
})
export class AttributesModule {}
