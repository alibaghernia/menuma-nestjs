import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHallDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsNumber()
  max_capacity: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;
}
