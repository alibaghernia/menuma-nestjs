import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions, Op } from 'sequelize';
import { getPagination } from 'src/utils/filter';
import { FiltersDTO } from '../dto/filters.dto';
import { Catalog } from '../entities/catalog.entity';

@Injectable()
export class CatalogsService {
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
}
