import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { FiltersPublicDTO } from 'src/event/dto/filters.dto';
import { EventService } from 'src/event/services/event.service';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';

@Controller('business/:business_slug/events')
@UseGuards(CheckBusinessExistsGuard)
@IsPublic()
export class EventController {
  constructor(private eventService: EventService) {}

  @Get(':uuid')
  async getById(
    @Req() req: Request,
    @Param('uuid', new UUIDChecker('Event UUID')) uuid: string,
  ) {
    const event = await this.eventService.get(uuid, req.business_guard.uuid);
    return {
      ok: true,
      data: event,
    };
  }

  @Get()
  async getAll(@Req() req: Request, @Query() filters: FiltersPublicDTO) {
    const [items, total] = await this.eventService.getAll({
      organizer_uuid: req.business_guard.uuid,
      ...filters,
    });

    return {
      ok: true,
      data: {
        items,
        total,
      },
    };
  }
}
