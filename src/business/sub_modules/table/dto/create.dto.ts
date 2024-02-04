import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTableDTO {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsNumber()
  max_capacity: number;

  @IsOptional()
  @IsUUID()
  hall_uuid: string;

  @IsOptional()
  @IsString()
  image: string;
}
