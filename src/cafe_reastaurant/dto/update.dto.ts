import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  isString,
} from 'class-validator';

export class UpdateCafeReastaurantDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly slug: string;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;

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
  @ValidateNested({ each: true })
  @Type(() => isString)
  readonly working_hours?: object[];

  @IsOptional()
  @IsString()
  readonly logo?: string;

  @IsOptional()
  @IsString()
  readonly banner?: string;
}
