import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '../entities/event.entity';
import { FiltersPublicDTO } from '../dto/filters.dto';
import { FindOptions, WhereOptions } from 'sequelize';
import { getPagination } from 'src/utils/filter';
import { Op } from 'sequelize';
import { Business } from 'src/business/entites/business.entity';
import { User } from 'src/users/entites/user.entity';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event) private eventRepository: typeof Event) {}

  async getAll({
    title = '',
    ...filters
  }: FiltersPublicDTO): Promise<[Event[], number]> {
    const { offset, limit } = getPagination(filters);

    const where: WhereOptions<Event> = {
      title: {
        [Op.like]: `%${title}%`,
      },
    };
    const include: FindOptions<Event>['include'] = [];
    if (filters.pin) where.pin = true;
    if (filters.organizer_uuid) where.organizer_uuid = filters.organizer_uuid;
    else {
      include.push({
        model: Business,
        where: {
          public: true,
        },
        attributes: {
          exclude: [
            'status',
            'location_lat',
            'location_long',
            'working_hours',
            'pager',
            'customer_club',
            'public',
            'pin',
          ],
        },
      });
      include.push({
        model: User,
        attributes: {
          exclude: ['mobile', 'password', 'username', 'email'],
        },
      });
    }
    const events = await this.eventRepository.findAll({
      where,
      offset,
      limit,
      include,
    });
    const count = await this.eventRepository.count({
      where,
    });

    if (!filters.organizer_uuid) {
      events.forEach((dis) => dis.business.setImages());
    }
    return [events, count];
  }

  async get(uuid: string, uuid_slug: string = '') {
    const where: WhereOptions<Event> = { uuid };
    const include: FindOptions<Event>['include'] = [];
    if (uuid_slug) {
      where[Op.or] = [
        { '$business.uuid$': uuid_slug },
        { '$business.slug$': uuid_slug },
        { '$user.uuid$': uuid_slug },
      ];
      include.push({
        model: Business,
        as: 'business',
        attributes: [],
      });
      include.push({
        model: User,
        as: 'user',
        attributes: [],
      });
    }
    if (!uuid_slug) {
      include.push({
        model: Business,
        where: {
          public: true,
        },
        attributes: {
          exclude: [
            'status',
            'location_lat',
            'location_long',
            'working_hours',
            'pager',
            'customer_club',
            'public',
            'pin',
          ],
        },
      });

      include.push({
        model: User,
        attributes: {
          exclude: ['mobile', 'password', 'username', 'email'],
        },
      });
    }
    const discount = await this.eventRepository.findOne({
      where,
      include,
    });
    return discount;
  }
}
