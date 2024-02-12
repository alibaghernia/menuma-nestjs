import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { Sequelize } from 'sequelize-typescript';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Business } from 'src/business/entites/business.entity';
import { FetchAllProductsDTO } from '../dto/filters.dto';
import { Category } from 'src/category/entities/category.entity';
import { File } from 'src/files/entities/file.entity';

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
        {
          model: File,
          through: {
            attributes: [],
          },
        },
      ].filter(Boolean),
    });
    if (with_categories)
      products.map((product) => {
        product.setDataValue(
          'categories',
          product.categories.map((cat) => cat.category) as any[],
        );
        return product;
      });
    const count = await this.productRepository.count({
      where,
    });

    return {
      products,
      total: count,
    };
  }

  async fetchOne(product_uuid: string, with_categories: boolean = false) {
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
          {
            model: File,
            through: { attributes: [] },
          },
        ].filter(Boolean),
      })
    ).get({ plain: true });
    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
    if (with_categories)
      product.setDataValue(
        'categories',
        product.categories.map((cat) => cat.category) as any[],
      );

    return product;
  }

  async offers() {
    const where = this.sequelize.fn(
      'JSON_CONTAINS',
      this.sequelize.col('metadata'),
      '"offer"',
    );
    const items = await this.productRepository.findAll({
      where,
      include: [
        {
          model: File,
          required: false,
          through: {
            attributes: [],
          },
        },
      ],
    });

    const count = await this.productRepository.count({
      where,
    });
    return [items, count];
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
