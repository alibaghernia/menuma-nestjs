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
