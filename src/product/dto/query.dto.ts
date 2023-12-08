import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindProductFiltersDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  uuid: string;
}
