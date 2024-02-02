import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class BusinessesFiltersDTO {
  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
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
  @IsArray()
  @IsEnum({ todo: 'TODO', doing: 'DOING', done: 'DONE' }, { each: true })
  status: ('TODO' | 'DOING' | 'DONE')[];

  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;
}
