import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBusinessDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly slug: string;

  @IsOptional()
  @IsString()
  readonly domain: string;

  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly location_lat?: string;

  @IsOptional()
  @IsString()
  readonly location_long?: string;

  @IsOptional()
  @IsString()
  readonly instagram?: string;

  @IsOptional()
  @IsString()
  readonly telegram?: string;

  @IsOptional()
  @IsString()
  readonly twitter_x?: string;

  @IsOptional()
  @IsString()
  readonly whatsapp?: string;

  @IsOptional()
  @IsString()
  readonly phone_number?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsArray()
  readonly working_hours?: unknown[];

  @IsOptional()
  @IsString()
  readonly logo?: string;

  @IsOptional()
  @IsString()
  readonly banner?: string;

  @IsOptional()
  @IsBoolean()
  readonly customer_club: boolean;

  @IsOptional()
  @IsBoolean()
  readonly pager: boolean;

  @IsOptional()
  @IsArray()
  readonly users: {
    user_uuid: string;
    role: string;
  }[];
}

export class CreateTableDTO {
  @IsString()
  code: string;
}
export class CreateHallDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  description: string;
}

export class NewPagerRequestDTO {
  @IsNotEmpty()
  @IsUUID()
  table_uuid: string;
}
