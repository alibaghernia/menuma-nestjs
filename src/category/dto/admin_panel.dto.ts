import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateDTO } from './create.dto';

export class CreateAdminDTO extends CreateDTO {
  @IsNotEmpty()
  @IsUUID()
  readonly business_uuid: string;
}
