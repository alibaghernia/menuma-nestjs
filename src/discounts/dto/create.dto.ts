import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum discountTypes {
  CONDITIONAL = 'CONDITIONAL',
  NORMAL = 'NORMAL',
  ALL = 'ALL',
}

export class CreateDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  discount: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(discountTypes)
  type: string;
}
