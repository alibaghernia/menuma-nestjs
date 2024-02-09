import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';

export class FiltersDTO extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;
}

export class FiltersPublicDTO extends FiltersDTO {
  @IsOptional()
  @IsBooleanString()
  readonly pin?: boolean;

  @IsOptional()
  @IsUUID()
  readonly organizer_uuid?: string;
}
