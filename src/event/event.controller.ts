import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDTO } from './dto/create.dto';
import { UUIDChecker } from '../pipes/uuid_checker.pipe';
import { IsPublic } from '../auth/decorators/is_public.decorator';
import { toSequelizeFilter } from '../filter';
import * as qs from 'qs';
import { getFullUrlFromReq } from '../getFullUrlFromReq';
import { Request } from 'express';
import { toSequelizeOrder } from '../order';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  create(@Body() body: CreateEventDTO) {
    return this.eventService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', new UUIDChecker('Event UUID')) uuid: string,
    @Body() body: CreateEventDTO,
  ) {
    return this.eventService.update(uuid, body);
  }

  @Delete(':id')
  delete(@Param('id', new UUIDChecker('Event UUID')) uuid: string) {
    return this.eventService.delete(uuid);
  }

  @Get(':id')
  @IsPublic()
  getById(@Param('id', new UUIDChecker('Event UUID')) uuid: string) {
    return this.eventService.getById(uuid);
  }

  @Get()
  @IsPublic()
  getAll(@Req() req: Request) {
    const { skip, limit, where, order } = qs.parse(
      getFullUrlFromReq(req).search.replace('?', ''),
    );
    return this.eventService.getAll(
      Number(skip ?? '0'),
      Number(limit ?? '20'),
      toSequelizeFilter(where ?? {}),
      toSequelizeOrder(order ?? []),
    );
  }
}
