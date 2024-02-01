import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { Sequelize } from 'sequelize-typescript';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { doInTransaction } from '../transaction';
import { CreateEventDTO } from './dto/create.dto';
import { FiltersDTO } from './dto/filters.dto';
import * as _ from 'lodash';

@Injectable()
export class EventService {
  private logger = new Logger(EventService.name);
  constructor(
    @InjectModel(Event)
    private eventRepository: typeof Event,

    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
  ) {}

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
  async getById(uuid: string) {
    return this.eventRepository.findOne({ where: { uuid } });
  }
  async getAll(filters: FiltersDTO) {
    const where = _.omitBy(
      {
        name: filters.name,
      },
      _.isUndefined,
    );
    const events = await this.eventRepository.findAll({
      offset: filters.page ? filters.page * filters.limit : undefined,
      limit: filters.page
        ? filters.page * filters.limit + filters.limit
        : undefined,
      where,
    });
    const total = await this.eventRepository.count({
      where,
    });
    return [events, total];
  }
}
