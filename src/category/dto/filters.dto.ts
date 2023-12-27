import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FiltersDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;
}

export class FetchCategoriesDTO extends FiltersDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return value == 'true' || value == '1';
  })
  with_items: boolean;
}
