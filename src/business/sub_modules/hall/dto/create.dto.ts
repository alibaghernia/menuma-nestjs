import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHallDTO {
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
