import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateVariantAttributeDto {
  @IsNumber()
  @IsNotEmpty()
  variant_id: number;

  @IsNumber()
  @IsNotEmpty()
  attribute_value_id: number;
}
