import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController, ProductsPublicController } from './controllers';
import { ProductService, VariantService } from './services';
import { Product, Variant } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant])],
  controllers: [ProductsController, ProductsPublicController],
  providers: [ProductService, VariantService],
  exports: [ProductService, VariantService],
})
export class ProductsModule {}
