import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ProductMetadata, ProductPrice } from '../entities/product.entity';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Metadata)
  metadata: ProductMetadata[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: ProductPrice[];

  @IsUUID()
  @IsNotEmpty()
  business_uuid: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];
}

class Metadata {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  value: string | number;
}

class Price {
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

class Category {
  @ValidateIf((e) => !e.title)
  @IsUUID()
  readonly uuid: string;

  @ValidateIf((e) => !e.uuid)
  @IsString()
  readonly title: string;
}
