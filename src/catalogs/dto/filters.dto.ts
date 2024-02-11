import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';

export class FiltersDTO extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly title?: string = '';

  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;
}
