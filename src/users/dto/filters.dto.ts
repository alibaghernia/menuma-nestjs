import { IsOptional, IsString } from 'class-validator';

export class FiltersDTO {
  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsString()
  readonly page?: number;

  @IsOptional()
  @IsString()
  readonly limit?: number;
}

export class GetManagersFiltersDTO {
  @IsOptional()
  @IsString()
  readonly no_business?: string;
}
