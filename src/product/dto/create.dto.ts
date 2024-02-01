import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  // IsUUID,
  // ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  // ProductMetadata,
  ProductPrice,
} from '../entities/product.entity';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Metadata)
  @IsString({ each: true })
  metadata: string[];
  // metadata: ProductMetadata[];

  @IsOptional()
  @IsString()
  image: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Price)
  prices: ProductPrice[];

  // @IsArray()
  // @IsString({ each: true })
  @IsString()
  categories: string;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Tag)
  // tags: Tag[];
}

// export class Metadata {
//   @IsNotEmpty()
//   @IsString()
//   title: string;

//   @IsNotEmpty()
//   value: string | number;
// }

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

// class Category {
//   @ValidateIf((e) => !e.title)
//   @IsUUID()
//   readonly uuid: string;
// }
