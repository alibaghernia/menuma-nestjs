import { IsOptional, IsString } from 'class-validator';

export class TablesFiltersDTO {
  @IsOptional()
  @IsString()
  code: string;

  @IsString()
  page: number;

  @IsString()
  limit: number;
}

export class PagerRequestsFiltersDTO {
  @IsOptional()
  @IsString()
  table: string;

  @IsString()
  page: number;

  @IsString()
  limit: number;
}
