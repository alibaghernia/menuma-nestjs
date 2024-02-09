import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDTO } from '../dto/create.dto';
import { FiltersDTO } from '../dto/filters.dto';
import { Event } from '../entities/event.entity';
import { Sequelize } from 'sequelize-typescript';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { doInTransaction } from 'src/utils/transaction';
import { getPagination } from 'src/utils/filter';

@Injectable()
export class EventPanelService {
  private logger = new Logger(EventPanelService.name);
  constructor(
    @InjectModel(Event)
    private eventRepository: typeof Event,

    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getById(uuid: string) {
    return this.eventRepository.findOne({ where: { uuid } });
  }
  async getAll(
    organizer_uuid: string,
    { title = '', ...filters }: FiltersDTO,
  ): Promise<[Event[], number]> {
    const where: WhereOptions<Event> = {
      organizer_uuid,
      title: {
        [Op.like]: `%${title}%`,
      },
    };

    const { offset, limit } = getPagination(filters);

    const events = await this.eventRepository.findAll({
      offset,
      limit,
      where,
    });
    const total = await this.eventRepository.count({
      where,
    });
    return [events, total];
  }
  async create(payload: CreateEventDTO) {
    return doInTransaction(this.sequelize, async (transaction) => {
      return this.eventRepository.create({ ...payload }, { transaction });
    });
  }
  async update(uuid: string, payload: CreateEventDTO) {
    return doInTransaction(this.sequelize, (transaction) => {
      return this.eventRepository.update(
        { ...payload },
        { transaction, where: { uuid } },
      );
    });
  }
  async delete(uuid: string) {
    return doInTransaction(this.sequelize, (transaction) => {
      return this.eventRepository.destroy({ transaction, where: { uuid } });
    });
  }
}
