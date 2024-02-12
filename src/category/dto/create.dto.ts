import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsUUID()
  parent_uuid: string;

  @IsEmpty()
  @IsUUID()
  business_uuid: string;
}
