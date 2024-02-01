import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDTO } from './dto/create.dto';
import { UUIDChecker } from '../pipes/uuid_checker.pipe';
import { IsPublic } from '../auth/decorators/is_public.decorator';
import { Request } from 'express';
import { FiltersDTO } from './dto/filters.dto';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  async create(@Body() body: CreateEventDTO) {
    await this.eventService.create(body);
    return {
      ok: true,
      message: 'Event created successfully!',
    };
  }

  @Put(':id')
  async update(
    @Param('id', new UUIDChecker('Event UUID')) uuid: string,
    @Body() body: CreateEventDTO,
  ) {
    await this.eventService.update(uuid, body);
    return {
      ok: true,
      message: 'Event updated successfully!',
    };
  }

  @Delete(':id')
  async delete(@Param('id', new UUIDChecker('Event UUID')) uuid: string) {
    await this.eventService.delete(uuid);
    return {
      ok: true,
      message: 'Event deleted successfully!',
    };
  }

  @Get(':id')
  @IsPublic()
  async getById(@Param('id', new UUIDChecker('Event UUID')) uuid: string) {
    const event = await this.eventService.getById(uuid);
    return {
      ok: true,
      data: event,
    };
  }

  @Get()
  @IsPublic()
  async getAll(@Req() req: Request, @Query() queryParams: FiltersDTO) {
    const [events, total] = await this.eventService.getAll(queryParams);
    return {
      ok: true,
      data: {
        events,
        total,
      },
    };
  }
}
