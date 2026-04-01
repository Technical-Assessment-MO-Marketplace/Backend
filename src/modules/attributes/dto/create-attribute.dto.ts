import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
