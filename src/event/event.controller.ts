import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDTO } from './dto/create.dto';
import { UUIDChecker } from '../pipes/uuid_checker.pipe';
import { IsPublic } from '../auth/decorators/is_public.decorator';

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
  getAll() {
    return this.eventService.getAll();
  }
}
