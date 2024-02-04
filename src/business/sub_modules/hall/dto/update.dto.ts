import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHallDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  description: string;
}
