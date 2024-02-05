import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class FiltersDTO {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsBooleanString()
  readonly pin?: boolean;

  @IsOptional()
  @IsString()
  readonly page?: number;

  @IsOptional()
  @IsString()
  readonly limit?: number;
}
