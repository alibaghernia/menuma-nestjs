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
import { ProductPrice } from '../entities/product.entity';
import { Price } from './create.dto';

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
  @IsString({ each: true })
  // @ValidateNested({ each: true })
  // @Type(() => Metadata)
  // metadata: ProductMetadata[];
  metadata: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: ProductPrice[];

  @IsOptional()
  // @IsString({ each: true })
  @IsString()
  categories: string;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Tag)
  // tags: Tag[];
}

// class Category {
//   @ValidateIf((e) => !e.title)
//   @IsUUID()
//   readonly uuid: string;
// }
