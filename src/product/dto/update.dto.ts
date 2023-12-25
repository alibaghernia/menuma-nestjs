import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  // IsUUID,
  // ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ProductMetadata, ProductPrice } from '../entities/product.entity';
import { Metadata, Price, Tag } from './create.dto';

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;

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
  @IsString({ each: true })
  categories: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  tags: Tag[];
}

// class Category {
//   @ValidateIf((e) => !e.title)
//   @IsUUID()
//   readonly uuid: string;
// }
