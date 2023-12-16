import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsUUID()
  parent_uuid: string;
}
