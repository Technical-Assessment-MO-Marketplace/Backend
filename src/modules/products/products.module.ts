import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController, ProductsPublicController } from './controllers';
import { ProductService, VariantService } from './services';
import { Product, Variant, VariantAttribute } from './entities';
import { AttributeValue } from '../attributes/entities/attribute-value.entity';
import { Attribute } from '../attributes/entities/attribute.entity';
import { ProductRepository, VariantRepository } from './repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Variant,
      VariantAttribute,
      AttributeValue,
      Attribute,
    ]),
  ],
  controllers: [ProductsController, ProductsPublicController],
  providers: [
    ProductService,
    VariantService,
    ProductRepository,
    VariantRepository,
  ],
  exports: [
    ProductService,
    VariantService,
    ProductRepository,
    VariantRepository,
  ],
})
export class ProductsModule {}
