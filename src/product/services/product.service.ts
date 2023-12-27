import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { Sequelize } from 'sequelize-typescript';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Business } from 'src/business/entites/business.entity';
import { FetchAllProductsDTO } from '../dto/filters.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Business) private businessRepository: typeof Business,
  ) {}

  async fetchAll(business_slug: string, filters: FetchAllProductsDTO) {
    const { limit, page, with_categories, ...otherFilters } = filters;
    const business = await this.businessRepository.findOne({
      where: {
        slug: business_slug,
      },
    });
    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
    const where = {
      business_uuid: business.uuid,
      ...otherFilters,
    };
    const products = await this.productRepository.findAll({
      where,
      limit: !page || !limit ? undefined : page * limit,
      offset: !page || !limit ? undefined : page * limit - limit,
      attributes: {
        exclude: ['business_uuid'],
      },
      include: [
        with_categories && {
          model: BusinessCategory,
          through: {
            attributes: [],
          },
          include: [
            {
              model: Category,
            },
          ],
        },
      ].filter(Boolean),
    });
    let result;
    if (with_categories) {
      result = products.map((_prod) => {
        const prod = _prod.get({ plain: true });
        const product = {
          ...prod,
          categories: prod.businessCategories.map((bCat) => bCat.category),
        };
        delete product.businessCategories;
        return product;
      });
    } else {
      result = products;
    }
    const count = await this.productRepository.count({
      where,
    });

    return {
      products: result,
      total: count,
    };
  }

  async fetchOne(product_uuid: string, with_categories: boolean) {
    const product = (
      await this.productRepository.findOne({
        where: {
          uuid: product_uuid,
        },
        attributes: {
          exclude: ['business_uuid'],
        },
        include: [
          with_categories && {
            model: BusinessCategory,
            through: {
              attributes: [],
            },
            include: [
              {
                model: Category,
              },
            ],
          },
        ].filter(Boolean),
      })
    )?.get({ plain: true });
    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
    let result;
    if (with_categories) {
      result = {
        ...product,
        categories: product.businessCategories.map((bCat) => bCat.category),
      };
      delete result.businessCategories;
    }
    return result || product;
  }

  async fetchCategoryProducts(category_uuid: string) {
    const query = {
      attributes: {
        exclude: ['business_uuid'],
      },
      include: [
        {
          model: BusinessCategory,
          attributes: [],
          where: {
            category_uuid,
          },
        },
      ],
    };
    const products = await this.productRepository.findAll(query);
    const count = await this.productRepository.count(query);
    return {
      products,
      count,
    };
  }
}
