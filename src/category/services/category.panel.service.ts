import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDTO } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Business } from 'src/business/entites/business.entity';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDTO } from '../dto/update.dto';
import { BusinessCategoryProduct } from 'src/product/entities/business-category_product.entity';
import { FiltersDTO } from '../dto/filters.dto';
import { Op } from 'sequelize';

@Injectable()
export class CategoryPanelService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(BusinessCategory)
    private businessCategoryRep: typeof BusinessCategory,
    @InjectModel(Category)
    private categoryRep: typeof Category,
    @InjectModel(Business)
    private businessRep: typeof Business,
    @InjectModel(BusinessCategoryProduct)
    private businessCategoryProductRep: typeof BusinessCategoryProduct,
  ) {}

  async fetchAll(business_uuid: string, _filters: FiltersDTO) {
    const { page, limit, ...filters } = _filters;
    const categoriesFilters = filters
      ? Object.fromEntries(
          Object.entries(filters).map(([k, v]) => [k, { [Op.like]: `%${v}%` }]),
        )
      : {};
    const business = (
      await this.businessRep.findOne({
        where: {
          uuid: business_uuid,
        },
        include: [
          {
            model: Category,
            where: categoriesFilters,
            through: {
              // attributes: [],
            },
          },
        ],
      })
    )?.get({ plain: true });
    if (filters && !business)
      return {
        categories: [],
        total: 0,
      };
    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

    const categories = business.categories as (Category & {
      BusinessCategory: any;
      products_count: number;
    })[];

    for (const category of categories) {
      category.products_count = await this.businessCategoryProductRep.count({
        where: {
          business_category_uuid: category.BusinessCategory.uuid,
        },
      });
      delete category.BusinessCategory;
    }
    return {
      categories:
        page && limit
          ? categories.slice(page * limit - limit, page * limit)
          : categories,
      total: categories.length,
    };
  }
  async findOne(category_uuid: string) {
    const category = await this.categoryRep.findOne({
      where: {
        uuid: category_uuid,
      },
      raw: true,
    });
    if (!category)
      throw new HttpException(
        'Category not found!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return category;
  }
  // TODO: add checking duplicate category creation
  async create(business_uuid: string, payload: CreateCategoryDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRep.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
      await business.createCategory({
        title: payload.title,
        parent_uuid: payload.parent_uuid,
        slug: payload.slug,
        image: payload.image,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // TODO: add checking duplicate category creation
  async update(category_uuid: string, payload: UpdateCategoryDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.categoryRep.update(payload, {
        where: {
          uuid: category_uuid,
        },
      });
      if (!business)
        throw new HttpException('Category not found!', HttpStatus.NOT_FOUND);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async remove(business_uuid: string, category_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRep.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
      await business.removeCategory(category_uuid);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
