import {
  IsBooleanString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationDto } from 'src/misc/dto/filters.dto';
import { organizerEnum } from './create.dto';

export class FiltersDTO extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly title?: string = '';

  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly limit: number;

  @IsOptional()
  @IsUUID()
  readonly organizer_uuid: string;

  @IsOptional()
  @IsEnum(organizerEnum)
  readonly organizer_type: string;
}

export class FiltersPublicDTO extends FiltersDTO {
  @IsOptional()
  @IsBooleanString()
  readonly pin?: boolean;

  @IsOptional()
  @IsDateString()
  readonly from: string;

  @IsOptional()
  @IsDateString()
  readonly to: string;
}
