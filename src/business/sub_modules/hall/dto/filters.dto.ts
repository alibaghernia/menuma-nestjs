import { IsOptional, IsString } from 'class-validator';

export class HallsFiltersDTO {
  @IsOptional()
  @IsString()
  code: string;

  @IsString()
  page: number;

  @IsString()
  limit: number;
}
