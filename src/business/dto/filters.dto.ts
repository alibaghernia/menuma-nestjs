import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class PanelBusinessesFiltersDTO {
  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  @IsString()
  name: string;
}
export class BusinessesFiltersDTO {
  @IsOptional()
  @IsString()
  page: number;

  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum({ 1: '1', true: 'true' })
  pin?: string;

  @IsOptional()
  @IsNumberString()
  distance?: string;

  @ValidateIf((d) => !!d.distance)
  @IsNumberString()
  location_lat?: string;

  @ValidateIf((d) => !!d.distance)
  @IsNumberString()
  location_long?: string;
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
export class MenuFiltersDTO {
  @IsOptional()
  @IsString()
  search: string = '';
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
