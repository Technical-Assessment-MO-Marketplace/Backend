import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController, ProductsPublicController } from './controllers';
import { ProductService, VariantService } from './services';
import { Product, Variant } from './entities';
import { VariantAttribute } from '../variants/entities/variant-attribute.entity';
import { AttributeValue } from '../attributes/entities/attribute-value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Variant,
      VariantAttribute,
      AttributeValue,
    ]),
  ],
  controllers: [ProductsController, ProductsPublicController],
  providers: [ProductService, VariantService],
  exports: [ProductService, VariantService],
})
export class ProductsModule {}
