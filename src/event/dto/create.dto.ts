import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { File } from '../../files/entities/file.entity';

export enum organizerEnum {
  USER = 'USER',
  BUSINESS = 'BUSINESS',
}

export enum cycleEnum {
  ONETIME = 'ONETIME',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsDateString()
  readonly startAt: string;

  @IsOptional()
  @IsDateString()
  readonly endAt: string;

  @IsOptional()
  @IsNumber()
  readonly limit: number;

  @IsOptional()
  @IsUUID()
  readonly bannerId: string;

  @IsOptional()
  @IsString()
  readonly shortDescription: string;

  @IsOptional()
  @IsString()
  readonly longDescription: string;

  @IsNotEmpty()
  @IsEnum(organizerEnum)
  readonly organizer_type: string;

  @IsNotEmpty()
  @IsUUID()
  readonly organizer_uuid: string;

  @IsNotEmpty()
  @IsEnum(cycleEnum)
  readonly cycle: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => File)
  readonly images: File[];
}
