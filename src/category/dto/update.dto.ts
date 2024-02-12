import { IsOptional } from 'class-validator';
import { CreateDTO } from './create.dto';

export class UpdateCategoryDTO extends CreateDTO {
  @IsOptional()
  title: string;

  @IsOptional()
  slug: string;

  @IsOptional()
  image: string;

  @IsOptional()
  parent_uuid: string;
}
