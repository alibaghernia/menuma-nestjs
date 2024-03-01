import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductPrice } from '../entities/product.entity';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metadata: string[];

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: ProductPrice[];

  @IsString()
  categories: string;

  @IsEmpty()
  business_uuid: string;
}

export class Price {
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class Tag {
  @IsString()
  value: string;
}
