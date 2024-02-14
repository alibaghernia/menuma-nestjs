import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';

export class GetAllDTO extends PaginationDto {
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsUUID()
  business_uuid: string;
}
