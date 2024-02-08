import {
  IsBooleanString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';
import { discountTypes } from './create.dto';

export class FiltersDTO extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsEnum(discountTypes)
  type: string;
}

export class PublicFiltersDTO extends PaginationDto {
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;

  @IsOptional()
  @IsBooleanString()
  pin?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsEmpty()
  business_uuid?: string;

  @IsNotEmpty()
  @IsEnum(discountTypes)
  type: string;
}
