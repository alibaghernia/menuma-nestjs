import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';

export enum organizerEnum {
  USER = 'USER',
  BUSINESS = 'BUSINESS',
}

export enum cycleEnum {
  ONETIME = 'ONETIME',
  DAYLY = 'DAYLY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly start_at: string;

  @IsOptional()
  @IsString()
  readonly end_at: string;

  @IsOptional()
  @IsNumber()
  readonly limit: number;

  @IsOptional()
  @IsUUID()
  readonly banner_uuid: string;

  @IsOptional()
  @IsString()
  readonly short_description: string;

  @IsOptional()
  @IsString()
  readonly long_description: string;

  @IsNotEmpty()
  @IsEnum(organizerEnum)
  readonly organizer_type: string;

  @IsNotEmpty()
  @IsUUID()
  readonly organizer_uuid: string;

  @IsNotEmpty()
  @IsEnum(cycleEnum)
  readonly cycle: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsUUID()
  readonly image: string;
}
