import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/create.dto';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/users/entites/user.entity';
import { Request } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Tag } from 'src/database/entities/tag.entity';

@Injectable()
export class ProductService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(business_uuid: string, payload: CreateProductDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const { categories, tags, ...prodPayload } = payload;
      const product = await this.productRepository.create({
        ...prodPayload,
        business_uuid,
      });

      for (const tag of tags) {
        await product.createTag({
          value: tag.value,
        });
      }
      await product.setCategories(categories.map((cat) => cat.uuid));

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
