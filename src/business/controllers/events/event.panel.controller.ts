import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CheckBusinessAccessGuard } from 'src/access_control/guards/check_buisness_access.guard';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { CreateEventDTO } from 'src/event/dto/create.dto';
import { EventPanelService } from 'src/event/services/event.panel.service';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';
import { FiltersDTO } from 'src/users/dto/filters.dto';

@Controller('panel/business/:business_uuid/events')
@UsePipes(new UUIDCheckerController('Business UUID', 'business_uuid'))
@UseGuards(
  CheckBusinessExistsGuard,
  CheckBusinessAccessGuard,
  CheckPermissionsGuard,
)
export class EventPanelController {
  constructor(private eventPanelService: EventPanelService) {}

  @Post()
  async create(@Body() body: CreateEventDTO) {
    await this.eventPanelService.create(body);
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
    await this.eventPanelService.update(uuid, body);
    return {
      ok: true,
      message: 'Event updated successfully!',
    };
  }

  @Delete(':id')
  async delete(@Param('id', new UUIDChecker('Event UUID')) uuid: string) {
    await this.eventPanelService.delete(uuid);
    return {
      ok: true,
      message: 'Event deleted successfully!',
    };
  }

  @Get(':id')
  async getById(@Param('id', new UUIDChecker('Event UUID')) uuid: string) {
    const event = await this.eventPanelService.getById(uuid);
    return {
      ok: true,
      data: event.setImages(),
    };
  }

  @Get()
  async getAll(
    @Param('business_uuid') business_uuid: string,
    @Query() queryParams: FiltersDTO,
  ) {
    const [events, total] = await this.eventPanelService.getAll(
      business_uuid,
      queryParams,
    );

    return {
      ok: true,
      data: {
        events: events.map((eve) => eve.setImages()),
        total,
      },
    };
  }
}
