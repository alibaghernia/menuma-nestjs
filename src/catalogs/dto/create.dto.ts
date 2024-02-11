import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateDTO {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly short_description: string;

  @IsOptional()
  @IsString()
  readonly long_description: string;

  @IsOptional()
  @IsUUID()
  readonly image: string;

  @IsOptional()
  @IsArray()
  readonly labels: string;

  @IsOptional()
  @IsBoolean()
  readonly soon: boolean;
}
