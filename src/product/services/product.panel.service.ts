import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { CreateProductDTO } from '../dto/create.dto';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/users/entites/user.entity';
import { Request } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Tag } from 'src/database/entities/tag.entity';
import { Category } from 'src/category/entities/category.entity';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { FindProductFiltersDTO } from '../dto/query.dto';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Image } from 'src/database/entities/image.entity';
import { Business } from 'src/business/entites/business.entity';
import { FiltersDTO } from '../dto/filters.dto';
import { File } from 'src/files/entities/file.entity';
import { getPagination } from 'src/utils/filter';

@Injectable()
export class ProductPanelService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(Image) private imageRepository: typeof Image,
    @InjectModel(Business) private businessRepository: typeof Business,
    @InjectModel(BusinessCategory)
    private businessCategoryRepository: typeof BusinessCategory,
    @Inject(REQUEST) private request: Request,
  ) {}

  async fetchAll(filters: FiltersDTO) {
    const { offset, limit } = getPagination(filters);
    const where: WhereOptions<Product> = {
      title: {
        [Op.like]: `%${filters.title}%`,
      },
    };
    const include: FindOptions<Product>['include'] = [
      {
        model: BusinessCategory,
        include: [
          {
            model: Category,
          },
        ],
      },
      {
        model: File,
      },
    ];
    if (filters.business_uuid) where.business_uuid = filters.business_uuid;
    else {
      include.push({
        model: Business,
        attributes: ['uuid', 'name', 'slug', 'status', 'logo'],
      });
    }
    const products = await this.productRepository.findAll({
      where,
      offset,
      limit,
      attributes: {
        exclude: ['business_uuid'],
      },
      include,
    });
    const count = await this.productRepository.count({
      where,
    });
    products.map((product: Product) => {
      product.business.setImages();
      product.setDataValue(
        'categories',
        product.categories.map((category) => category.category) as any[],
      );
      return product;
    });
    console.log('find all');
    return {
      products,
      total: count,
    };
  }
  async findOne(business_uuid: string, filter: FindProductFiltersDTO) {
    // parse filters
    const parsedFilter = Object.fromEntries(
      Object.entries(filter)
        .filter(([, v]) => v)
        .map(([k, v]) => [k, { [Op.like]: `%${v}%` }]),
    );
    const where: WhereOptions<Product> = {
      business_uuid,
      ...parsedFilter,
    };

    const product = (
      await this.productRepository.findOne({
        where,
        attributes: {
          exclude: ['business_uuid'],
        },
        include: [
          {
            model: BusinessCategory,
            include: [
              {
                model: Category,
              },
              {
                model: File,
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
      })
    )?.get({ plain: true });

    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
    product.setDataValue(
      'categories',
      product.categories.map((category) => category.category) as any[],
    );

    return product;
  }
  async get(uuid: string) {
    const include: FindOptions<Product>['include'] = [
      {
        model: BusinessCategory,
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
      {
        model: Business,
        attributes: ['uuid', 'name', 'slug', 'status', 'logo'],
      },
    ];

    const item = await this.productRepository.findOne({
      where: {
        uuid,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
      include,
    });
    if (!item) throw new HttpException('Item not found!', HttpStatus.NOT_FOUND);
    item.setDataValue(
      'categories',
      item.categories.map((cat) => cat.category) as any[],
    );
    item.business.setImages();
    return item;
  }
  async findOneByUuid(business_uuid: string, uuid: string) {
    const where: WhereOptions<Product> = {
      business_uuid,
      uuid,
    };

    const product = await this.productRepository.findOne({
      where,
      attributes: {
        exclude: ['business_uuid'],
      },
      include: [
        {
          model: BusinessCategory,
          include: [
            {
              model: Category,
            },
          ],
        },
        {
          model: File,
          attributes: ['uuid'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!product)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
    product.setDataValue(
      'categories',
      product.categories.map((category) => category.category) as any[],
    );

    return product;
  }
  async create(payload: CreateProductDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: payload.business_uuid,
        },
        transaction,
      });
      const { categories, image, ...prodPayload } = payload;
      const product = await this.productRepository.create(prodPayload, {
        transaction,
      });
      if (image) {
        await product.setImages([image], { transaction });
      }
      if (await business.hasCategory(categories, { transaction })) {
        const categoriesIns = await this.businessCategoryRepository.findAll({
          where: {
            business_uuid: payload.business_uuid,
            category_uuid: categories,
          },
          transaction,
        });
        await product.setCategories(categoriesIns, { transaction });
      } else
        throw new HttpException(
          'One or more of these categories are not associate with this business!',
          HttpStatus.BAD_REQUEST,
        );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async update(product_uuid: string, payload: CreateProductDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: payload.business_uuid,
        },
        transaction,
      });
      const { categories, image, ...prodPayload } = payload;
      await this.productRepository.update(prodPayload, {
        where: {
          uuid: product_uuid,
        },
        transaction,
      });
      const product = await this.productRepository.findOne({
        where: {
          uuid: product_uuid,
        },
        transaction,
        include: [Tag],
      });
      if (!product)
        throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

      // handle image
      if (image) {
        await product.setImages([image], {
          transaction,
        });
      }

      if (categories) {
        if (
          await business.hasCategory(categories, {
            transaction,
          })
        ) {
          const categoriesIns = await this.businessCategoryRepository.findAll({
            where: {
              business_uuid: payload.business_uuid,
              // category_uuid: categories.map((cat) => cat),
              category_uuid: categories,
            },
            transaction,
          });
          await product.setCategories(categoriesIns, { transaction });
        } else
          throw new HttpException(
            'One or more of these categories are not associate with this business!',
            HttpStatus.BAD_REQUEST,
          );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async delete(uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.productRepository.destroy({
        where: {
          uuid,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
