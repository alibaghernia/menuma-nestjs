import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from '../entities/request.entity';
import { FiltersDTO } from '../dto/filters.dto';
import { getPagination } from 'src/utils/filter';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class RequestsPanelService {
  constructor(
    @InjectModel(Request) private requestRepository: typeof Request,
  ) {}

  async getAll(filters: FiltersDTO) {
    const where: WhereOptions<Request> = {
      name: {
        [Op.like]: `%${filters.search}%`,
      },
    };
    const { offset, limit } = getPagination(filters);

    const items = await this.requestRepository.findAll({
      where,
      offset,
      limit,
    });
    const count = await this.requestRepository.count({
      where,
    });
    return [items, count];
  }

  async delete(uuid: string) {
    const item = await this.requestRepository.findOne({
      where: {
        uuid,
      },
    });
    if (!item)
      throw new HttpException('Request not found!', HttpStatus.NOT_FOUND);
    await item.destroy();
  }
}
