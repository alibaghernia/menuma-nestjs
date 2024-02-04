import { IsOptional, IsString } from 'class-validator';

export class UpdateTableDTO {
  @IsOptional()
  @IsString()
  code: string;
}
