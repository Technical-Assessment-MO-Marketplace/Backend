import { IsArray, IsInt, IsPositive } from 'class-validator';

export class FilterVariantDto {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  attributeValueIds: number[];
}
