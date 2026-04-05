import { IsInt, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsInt({ message: 'Product ID must be an integer' })
  @IsPositive({ message: 'Product ID must be a positive number' })
  product_id!: number;

  @IsInt({ message: 'Variant ID must be an integer' })
  @IsPositive({ message: 'Variant ID must be a positive number' })
  variant_id!: number;

  @IsInt({ message: 'Quantity must be an integer' })
  @IsPositive({ message: 'Quantity must be at least 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({
    each: true,
    message: 'Each item must have valid product_id, variant_id, and quantity',
  })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
