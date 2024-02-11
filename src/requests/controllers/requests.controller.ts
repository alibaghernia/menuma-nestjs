import { Body, Controller, Post } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { RequestsService } from '../services/requests.service';
import { CreateDTO } from '../dto/create.dto';

@Controller('requests')
@IsPublic()
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Post()
  async create(@Body() body: CreateDTO) {
    await this.requestsService.create(body);

    return {
      ok: true,
      message: 'Request created successfully!',
    };
  }
}
