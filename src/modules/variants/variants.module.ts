import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantAttribute } from './entities/variant-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, VariantAttribute])],
  exports: [TypeOrmModule],
})
export class VariantsModule {}
