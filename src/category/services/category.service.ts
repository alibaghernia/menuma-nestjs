import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../entities/category.entity';
import { CreateCategoryDTO } from '../dto';
import { FetchCategoriesDTO } from '../dto/filters.dto';
import { WhereOptions } from 'sequelize';
import { Business } from 'src/business/entites/business.entity';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Product } from 'src/product/entities/product.entity';
import { File } from 'src/files/entities/file.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    @InjectModel(BusinessCategory)
    private businessCategoryRepository: typeof BusinessCategory,
    @InjectModel(Business) private businessRepository: typeof Business,
  ) {}
  async findAll(business_slug: string, filters: FetchCategoriesDTO) {
    const { page, limit, with_items } = filters;
    const business = await this.businessRepository.findOne({
      where: {
        slug: business_slug,
      },
    });
    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
    const where: WhereOptions<BusinessCategory> = {
      business_uuid: business.uuid,
    };
    const categories = await this.businessCategoryRepository.findAll({
      where,
      limit: !page || !limit ? undefined : page * limit,
      offset: !page || !limit ? undefined : page * limit - limit,
      include: [
        with_items && {
          model: Product,
          attributes: { exclude: ['business_uuid'] },
          through: { attributes: [] },
          include: [
            {
              model: File,
              through: { attributes: [] },
            },
          ],
        },
        { model: Category },
      ].filter(Boolean),
    });
    const count = await this.businessCategoryRepository.count({
      where,
    });
    const result = categories.map((cat) => {
      const category = cat.get({
        plain: true,
      });
      return {
        ...category.category,
        products: category.products.map((product) => ({
          ...product,
          category_uuid: category.category.uuid,
          images: product.images.map((img) => img.uuid),
        })),
      };
    });
    return {
      categories: result,
      total: count,
    };
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
  async findByUUID(uuid: string, with_items: boolean) {
    let category = await this.businessCategoryRepository.findOne({
      where: {
        category_uuid: uuid,
      },
      include: [
        with_items && {
          model: Product,
          attributes: { exclude: ['business_uuid'] },
          through: { attributes: [] },
        },
        { model: Category },
      ].filter(Boolean),
    });
    if (!category)
      throw new HttpException('Category not found!', HttpStatus.NOT_FOUND);
    category = category.get({ plain: true });
    const result = { ...category.category, products: category.products };
    return result;
  }

  create(category: CreateCategoryDTO) {
    return this.categoryRepository.create({
      title: category.title,
      slug: category.slug,
      parent_uuid: category.parent_uuid,
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
