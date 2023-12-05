import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { CreateCategoryDTO } from './dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}
  findAll() {
    return this.categoryRepository.findAll({});
  }
  findAllWithChilds() {
    return this.categoryRepository.findAll({
      include: [Category],
    });
  }
  findCategoryByTitle(title: string) {
    return this.categoryRepository.findOne({
      where: {
        title,
      },
    });
  }
  findCategoryBySlug(slug: string) {
    return this.categoryRepository.findOne({
      where: {
        slug,
      },
    });
  }

  create(category: CreateCategoryDTO) {
    return this.categoryRepository.create({
      title: category.title,
      slug: category.slug,
      parent_uuid: category.parent,
    });
  }

  async setCategoryParent(category_uuid: string, parent_uuid: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        uuid: category_uuid,
      },
    });
    if (!category)
      throw new HttpException('Category Not Found!', HttpStatus.NOT_FOUND);
    category.parent_uuid = parent_uuid;
    return await category.save();
  }
}
