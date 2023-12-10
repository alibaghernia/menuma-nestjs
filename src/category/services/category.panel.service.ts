import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDTO } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Business } from 'src/business/entites/business.entity';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDTO } from '../dto/update.dto';

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
  ) {}

  async fetchAll(business_uuid: string) {
    const business = await this.businessRep.findOne({
      where: {
        uuid: business_uuid,
      },
      include: [
        {
          model: Category,
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
    return business.categories;
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