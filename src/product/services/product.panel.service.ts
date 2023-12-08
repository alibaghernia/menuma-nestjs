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
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class ProductPanelService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @Inject(REQUEST) private request: Request,
  ) {}

  async fetchAll(
    business_uuid: string,
    pagination: { page: number; limit: number },
    filter: FindProductFiltersDTO,
  ) {
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
    const products = await this.productRepository.findAll({
      where,
      offset: pagination.page * pagination.limit - pagination.limit,
      limit: pagination.page * pagination.limit,
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
      ],
    });
    const count = await this.productRepository.count({
      where,
    });

    return {
      products: products
        .map((item) => item.get({ plain: true }))
        .map(
          ({
            businessCategories,
            ...product
          }: Product & { categories: Category[] }) => {
            product.categories =
              businessCategories?.map((besCat) => {
                return besCat.category;
              }) || [];
            return product;
          },
        ),
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

    const result = (
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
            ],
          },
        ],
      })
    )?.get({ plain: true });

    if (!result)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

    const { businessCategories, ...product } = result;

    (product as Product & { categories?: Category[] }).categories =
      businessCategories.map((besCat) => besCat.category);

    return product;
  }
  async findOneByUuid(business_uuid: string, uuid: string) {
    const where: WhereOptions<Product> = {
      business_uuid,
      uuid,
    };

    const result = (
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
            ],
          },
        ],
      })
    )?.get({ plain: true });

    if (!result)
      throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

    const { businessCategories, ...product } = result;

    (product as Product & { categories?: Category[] }).categories =
      businessCategories.map((besCat) => besCat.category);

    return product;
  }
  async create(business_uuid: string, payload: CreateProductDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const { categories, tags, ...prodPayload } = payload;
      const product = await this.productRepository.create({
        ...prodPayload,
        business_uuid,
      });
      for (const tag of tags) {
        const [newTag] = await this.tagRepository.findOrCreate({
          defaults: {
            value: tag.value,
            tagable_type: 'product',
            tagable_uuid: product.uuid,
          },
          where: {
            value: tag.value,
            uuid: product.uuid,
          },
        });
        await product.addTag(newTag);
      }
      await product.setBusinessCategories(categories.map((cat) => cat.uuid));

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async update(product_uuid: string, payload: CreateProductDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const { categories, tags, ...prodPayload } = payload;
      await this.productRepository.update(
        {
          ...prodPayload,
        },
        {
          where: {
            uuid: product_uuid,
          },
        },
      );
      const product = await this.productRepository.findOne({
        where: {
          uuid: product_uuid,
        },
        include: [Tag],
      });
      if (!product)
        throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
      for (const tag of tags) {
        const [newTag] = await this.tagRepository.findOrCreate({
          defaults: {
            value: tag.value,
            tagable_type: 'product',
            tagable_uuid: product_uuid,
          },
          where: {
            value: tag.value,
            uuid: product.uuid,
          },
        });
        await product.addTag(newTag);
      }

      // check deleted tags
      const deletedTags = product.tags.filter(
        (item) => !tags.some((tag) => tag.value == item.value),
      );
      await this.tagRepository.destroy({
        where: {
          uuid: {
            [Op.or]: deletedTags.map((item) => item.uuid),
          },
        },
      });

      await product.setBusinessCategories(categories.map((cat) => cat.uuid));

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async delete(business_uuid: string, uuid: string) {
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
