import { IsOptional, IsString } from 'class-validator';

export class HallsFiltersDTO {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  page?: number;

  @IsOptional()
  @IsString()
  limit?: number;
}
