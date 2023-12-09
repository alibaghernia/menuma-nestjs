import { IsOptional } from 'class-validator';
import { CreateCategoryDTO } from './create.dto';

export class UpdateCategoryDTO extends CreateCategoryDTO {
  @IsOptional()
  title: string;

  @IsOptional()
  slug: string;

  @IsOptional()
  parent_uuid: string;
}
