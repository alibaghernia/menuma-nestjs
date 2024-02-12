import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDTO } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Business } from 'src/business/entites/business.entity';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDTO } from '../dto/update.dto';
import { BusinessCategoryProduct } from 'src/product/entities/business-category_product.entity';
import { FiltersDTO } from '../dto/filters.dto';
import { FindOptions, WhereOptions } from 'sequelize';
import { getPagination } from 'src/utils/filter';
import { Product } from 'src/product/entities/product.entity';
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

  async fetchAll(filters: FiltersDTO) {
    const { offset, limit } = getPagination(filters);

    const where: WhereOptions<BusinessCategory> = {};
    const include: FindOptions<BusinessCategory>['include'] = [
      {
        model: Category,
        where: {
          title: {
            [Op.like]: `%${filters.title}%`,
          },
        },
      },
      {
        model: Product,
      },
      {
        model: Business,
        attributes: ['uuid', 'name', 'slug', 'logo'],
      },
    ];
    if (filters.business_uuid) where.business_uuid = filters.business_uuid;

    const busCategories = await this.businessCategoryRep.findAll({
      where,
      offset,
      limit,
      include,
    });

    const count = await this.businessCategoryRep.count({
      where,
    });

    const categories = busCategories.map((busCat) => {
      return {
        ...(busCat.category?.setImageUrl().toJSON() || {}),
        products_count: busCat.products.length,
        business: busCat.business?.setImages(),
      };
    });
    return {
      categories,
      total: count,
    };
  }
  async findOne(category_uuid: string) {
    const category = await this.categoryRep.findOne({
      where: {
        uuid: category_uuid,
      },
      include: [
        {
          model: Business,
          attributes: ['uuid', 'name', 'slug', 'logo'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!category)
      throw new HttpException(
        'Category not found!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    category.setDataValue('business', category.businesses[0]?.setImages());
    delete category.businesses;
    return category;
  }
  // TODO: add checking duplicate category creation
  async create(payload: CreateDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRep.findOne({
        where: {
          uuid: payload.business_uuid,
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
  async update(uuid: string, payload: UpdateCategoryDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.categoryRep.update(payload, {
        where: {
          uuid: uuid,
        },
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async remove(uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.categoryRep.destroy({
        where: {
          uuid,
        },
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
