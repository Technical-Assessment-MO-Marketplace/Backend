import { IsArray, IsInt, IsPositive } from 'class-validator';

export class FilterVariantDto {
  @IsArray({ message: 'Attribute value IDs must be an array' })
  @IsInt({ each: true, message: 'Each attribute value ID must be an integer' })
  @IsPositive({
    each: true,
    message: 'Each attribute value ID must be a positive number',
  })
  attributeValueIds!: number[];
}
