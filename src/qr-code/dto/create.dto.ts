import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateQrCodeDTO {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(['redirect'])
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsObject()
  metadata: object;
}
