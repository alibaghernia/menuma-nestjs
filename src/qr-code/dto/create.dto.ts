import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDTO {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(['redirect'])
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsObject()
  metadata: object;

  business_uuid: string;
}
export class UpdateDTO extends CreateDTO {
  @IsOptional()
  type: string;
  @IsOptional()
  metadata: object;
}
export class CreateQrCodeAdminDTO extends CreateDTO {
  @IsOptional()
  @IsUUID()
  business_uuid: string;
}
