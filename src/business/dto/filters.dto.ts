import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BusinessesFiltersDTO {
  @IsString()
  page: number;

  @IsString()
  limit: number;
}
export class TablesFiltersDTO {
  @IsOptional()
  @IsString()
  code: string;

  @IsString()
  page: number;

  @IsString()
  limit: number;
}

export class HallsFiltersDTO {
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

  @IsOptional()
  @IsEnum({ todo: 'TODO', doing: 'DOING', done: 'DONE' })
  status: 'TODO' | 'DOING' | 'DONE';

  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;
}
