import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDTO } from '../dto/create.dto';
import { FiltersDTO } from '../dto/filters.dto';
import { Event } from '../entities/event.entity';
import { Sequelize } from 'sequelize-typescript';
import { FindOptions, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { doInTransaction } from 'src/utils/transaction';
import { getPagination } from 'src/utils/filter';
import { Business } from 'src/business/entites/business.entity';
import { User } from 'src/users/entites/user.entity';

@Injectable()
export class EventPanelService {
  private logger = new Logger(EventPanelService.name);
  constructor(
    @InjectModel(Event)
    private eventRepository: typeof Event,

    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
  ) {}

  async get(uuid: string, include_business: boolean = false) {
    const include: FindOptions<Event>['include'] = [];
    if (include_business) {
      include.push({
        model: Business,
        required: false,
        attributes: ['uuid', 'name', 'slug', 'logo'],
      });
      include.push({
        model: User,
        required: false,
        attributes: ['uuid', 'first_name', 'last_name'],
      });
    }
    const item = await this.eventRepository.findOne({
      where: { uuid },
      include,
    });
    if (include_business) item.business.setImages();
    return item;
  }
  async getAll(
    filters: FiltersDTO,
    include_business: boolean = false,
  ): Promise<[Event[], number]> {
    const where: WhereOptions<Event> = {
      title: {
        [Op.like]: `%${filters.title}%`,
      },
    };
    if (filters.organizer_type) where.organizer_type = filters.organizer_type;
    if (filters.organizer_uuid) where.organizer_uuid = filters.organizer_uuid;

    const include: FindOptions<Event>['include'] = [];
    if (include_business) {
      include.push({
        model: Business,
        required: false,
        attributes: ['uuid', 'name', 'slug', 'logo'],
      });
      include.push({
        model: User,
        required: false,
        attributes: ['uuid', 'first_name', 'last_name'],
      });
    }
    const { offset, limit } = getPagination(filters);

    const events = await this.eventRepository.findAll({
      offset,
      limit,
      where,
      include,
    });
    const total = await this.eventRepository.count({
      where,
    });
    if (include_business) events.forEach((eve) => eve.business.setImages());
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
