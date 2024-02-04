import { IsString } from 'class-validator';

export class CreateTableDTO {
  @IsString()
  code: string;
}
