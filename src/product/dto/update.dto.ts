import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ProductMetadata, ProductPrice } from '../entities/product.entity';

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Metadata)
  metadata: ProductMetadata[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: ProductPrice[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  tags: Tag[];
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

class Tag {
  @IsString()
  value: string;
}

class Category {
  @ValidateIf((e) => !e.title)
  @IsUUID()
  readonly uuid: string;
}
