import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';

export class FiltersDTO extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly title: string = '';

  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;

  @IsOptional()
  @IsUUID()
  business_uuid: string;
}

export class FetchAllProductsDTO extends FiltersDTO {
  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value == '1' || value == 'true')
  readonly with_categories: boolean;
}
