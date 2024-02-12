import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateProductDTO } from './create.dto';

export class CreateProductAdminDTO extends CreateProductDTO {
  @IsNotEmpty()
  @IsUUID()
  readonly business_uuid: string;

  @IsOptional()
  @IsBoolean()
  readonly pin: string;
}
