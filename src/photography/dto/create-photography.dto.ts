import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePhotographyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly cafe_name: string;

  @IsNotEmpty()
  @IsString()
  readonly phone_number: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
