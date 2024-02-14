import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Catalog } from '../entities/catalog.entity';
import { FiltersDTO } from '../dto/filters.dto';
import { getPagination } from 'src/utils/filter';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { CreateDTO } from '../dto/create.dto';

@Injectable()
export class CatalogsPanelService {
  constructor(
    @InjectModel(Catalog) private catalogRepository: typeof Catalog,
  ) {}

  async getAll(filters: FiltersDTO) {
    const where: WhereOptions<Catalog> = {
      title: {
        [Op.like]: `%${filters.title}%`,
      },
    };
    const { offset, limit } = getPagination(filters);

    const items = await this.catalogRepository.findAll({
      where,
      offset,
      limit,
    });
    const count = await this.catalogRepository.count({
      where,
    });
    return [items, count];
  }

  async get(uuid: string) {
    const item = await this.catalogRepository.findOne({
      where: {
        uuid,
      },
    });

    if (!item)
      throw new HttpException('Catalog not found!', HttpStatus.NOT_FOUND);

    return item;
  }

  async create(payload: CreateDTO) {
    return await this.catalogRepository.create(payload);
  }

  async update(uuid: string, payload: CreateDTO) {
    const item = await this.catalogRepository.findOne({
      where: {
        uuid,
      },
    });
    if (!item)
      throw new HttpException('Catalog not found!', HttpStatus.NOT_FOUND);
    await item.update(payload);
  }

  async delete(uuid: string) {
    const item = await this.catalogRepository.findOne({
      where: {
        uuid,
      },
    });
    if (!item)
      throw new HttpException('Catalog not found!', HttpStatus.NOT_FOUND);
    await item.destroy();
  }
}
