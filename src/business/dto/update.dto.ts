import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateBusinessDTO {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
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
  @IsUUID()
  readonly manager: string;

  @IsOptional()
  @IsBoolean()
  readonly customer_club: boolean;

  @IsOptional()
  @IsBoolean()
  readonly pager: boolean;
}

export class UpdateTableDTO {
  @IsOptional()
  @IsString()
  code: string;
}

export class UpdateHallDTO {
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

export class UpdatePagerRequestDTO {
  @IsOptional()
  @IsEnum({ todo: 'TODO', doing: 'DOING', done: 'DONE', canceled: 'CANCELED' })
  status: string;
}
