import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IsAdmin } from 'src/auth/decorators/is_public.decorator';
import { FiltersDTO } from '../dto/filters.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { EventPanelService } from '../services/event.panel.service';
import { CreateEventDTO } from '../dto/create.dto';

@Controller('panel/event')
@IsAdmin()
export class EventPanelController {
  constructor(private eventPanelService: EventPanelService) {}

  @Get()
  async getAll(@Query() filters: FiltersDTO) {
    const [events, total] = await this.eventPanelService.getAll(filters, true);

    return {
      ok: true,
      data: {
        items: events,
        total,
      },
    };
  }

  @Get(':uuid')
  async getById(@Param('uuid', new UUIDChecker('Event UUID')) uuid: string) {
    const event = await this.eventPanelService.get(uuid, true);
    return {
      ok: true,
      data: event,
    };
  }

  @Post()
  async create(@Body() payload: CreateEventDTO) {
    const event = await this.eventPanelService.create(payload);
    return {
      ok: true,
      message: 'Event created successfully!',
      data: {
        uuid: event.uuid,
      },
    };
  }

  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() payload: CreateEventDTO) {
    await this.eventPanelService.update(uuid, payload);
    return {
      ok: true,
      message: 'Event updated successfully!',
    };
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.eventPanelService.delete(uuid);
    return {
      ok: true,
      message: 'Event deleted successfully!',
    };
  }
}
