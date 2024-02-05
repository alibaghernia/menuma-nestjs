import { Controller } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';

@Controller('events')
@IsPublic()
export class EventController {}
