import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { Sequelize } from 'sequelize-typescript';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { doInTransaction } from '../transaction';
import { CreateEventDTO } from './dto/create.dto';
import { Order, WhereOptions } from 'sequelize/types/model';

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
  async getAll(
    skip: number,
    limit: number,
    where: WhereOptions<Event>,
    order: Order,
  ) {
    return this.eventRepository.findAll({ offset: skip, limit, where, order });
  }
}
