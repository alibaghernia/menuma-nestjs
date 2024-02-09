import { Controller, Get, Param, Query } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { EventService } from '../services/event.service';
import { FiltersPublicDTO } from '../dto/filters.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';

@Controller('events')
@IsPublic()
export class EventController {
  constructor(private eventService: EventService) {}

  @Get()
  async getAll(@Query() filters: FiltersPublicDTO) {
    const [events, total] = await this.eventService.getAll(filters);

    return {
      ok: true,
      data: {
        items: events,
        total,
      },
    };
  }

  @Get(':uuid')
  async getById(
    @Param('uuid', new UUIDChecker('Event UUID')) uuid: string,
    @Query('organizer_uuid') organizer_uuid: string,
  ) {
    const event = await this.eventService.get(uuid, organizer_uuid);
    return {
      ok: true,
      data: event?.setImages() || null,
    };
  }
}
