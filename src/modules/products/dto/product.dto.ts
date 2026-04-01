import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class VariantDataDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsArray()
  @IsNotEmpty()
  attributeValueIds: number[];
}

export class CreateVariantDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsArray()
  @IsNotEmpty()
  attributeValueIds: number[];
}
