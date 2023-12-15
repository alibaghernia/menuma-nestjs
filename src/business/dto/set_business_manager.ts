import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetBusinessManagerDTO {
  @IsNotEmpty()
  @IsUUID()
  user_uuid: string;
}
