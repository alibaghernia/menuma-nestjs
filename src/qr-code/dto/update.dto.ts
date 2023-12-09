import { IsOptional } from 'class-validator';

export class UpdateQrCodeDTO {
  @IsOptional()
  slug: string;

  @IsOptional()
  type: string;

  @IsOptional()
  metadata: object;
}
