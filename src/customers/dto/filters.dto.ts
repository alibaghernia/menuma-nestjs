import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';

export class CustomersFilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
}
