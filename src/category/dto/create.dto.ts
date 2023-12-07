import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsUUID()
  parent: string;
}
