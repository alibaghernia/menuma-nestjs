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
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as fs from 'fs';
import { Image } from 'src/database/entities/image.entity';
import { Business } from 'src/business/entites/business.entity';

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
    private configService: ConfigService,
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
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
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
      if (await business.hasCategories(categories.map((cat) => cat.uuid))) {
        const categoriesIns = await this.businessCategoryRepository.findAll({
          where: {
            business_uuid,
            category_uuid: categories.map((cat) => cat.uuid),
          },
        });
        await product.setBusinessCategories(categoriesIns);
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
  async update(
    business_uuid: string,
    product_uuid: string,
    payload: CreateProductDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
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

      // if tags field is presented
      if (tags) {
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
            uuid: deletedTags.map((item) => item.uuid),
          },
        });
      }

      // if categories field is presented
      if (categories) {
        if (await business.hasCategories(categories.map((cat) => cat.uuid))) {
          const categoriesIns = await this.businessCategoryRepository.findAll({
            where: {
              business_uuid,
              category_uuid: categories.map((cat) => cat.uuid),
            },
          });
          await product.setBusinessCategories(categoriesIns);
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

  async savePhotos(
    business_uuid: string,
    product_uuid: string,
    photos: Express.Multer.File[],
    current_items: string[],
  ) {
    const t = await this.sequelize.transaction();
    const savedPhotos = [];
    const fs_path = join(__dirname, '../../../');
    const static_images_path = join(
      this.configService.get('IMAGES_PATH'),
      'products',
    );
    try {
      const product = await this.productRepository.findOne({
        where: {
          uuid: product_uuid,
        },
        include: [Image],
      });
      if (!product)
        throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

      if (!fs.existsSync(join(fs_path, static_images_path)))
        fs.mkdirSync(join(fs_path, static_images_path), { recursive: true });
      for (const photo of photos) {
        const file_name = `${business_uuid}-${product_uuid}-${photo.originalname}`;
        const savePath = join(fs_path, static_images_path, file_name);

        // remove deleted items
        const deletedImages = product.images.filter(
          (item) =>
            !photos.some((photo) => photo.originalname == item.name) &&
            !current_items.some((cItem) => cItem == item.name),
        );
        await this.imageRepository.destroy({
          where: {
            uuid: deletedImages.map((item) => item.uuid),
          },
        });
        for (const deletedImage of deletedImages) {
          if (
            fs.existsSync(join(fs_path, static_images_path, deletedImage.path))
          )
            fs.rmSync(join(fs_path, static_images_path, deletedImage.path));
        }
        const [, created] = await this.imageRepository.findOrCreate({
          where: {
            path: file_name,
          },
          defaults: {
            imageable_type: 'product',
            imageable_uuid: product.uuid,
            path: file_name,
            name: photo.originalname,
          },
        });
        if (created) {
          fs.writeFileSync(savePath, photo.buffer);
          savedPhotos.push(savePath);
        }
      }

      await t.commit();
    } catch (error) {
      await t.rollback();

      for (const path of savedPhotos) {
        if (fs.existsSync(path)) fs.rmSync(path);
      }

      throw error;
    }
  }
}
