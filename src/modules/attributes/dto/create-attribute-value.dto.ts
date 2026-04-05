import { IsString, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateAttributeValueDto {
  @IsNumber()
  @IsNotEmpty()
  attribute_id!: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  value!: string;
}
