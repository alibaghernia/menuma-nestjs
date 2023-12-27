import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FiltersDTO {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsString()
  readonly page: number;

  @IsString()
  readonly limit: number;
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
