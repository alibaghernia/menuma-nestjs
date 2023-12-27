import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FiltersDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  page: number;

  @IsString()
  limit: number;
}

export class FetchAllProductsDTO extends FiltersDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value == '1' || value == 'true')
  with_categories: boolean;
}
