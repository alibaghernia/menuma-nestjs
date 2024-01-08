import { Controller, Get, Post, Body } from '@nestjs/common';
import { PhotographyService } from './photography.service';
import { CreatePhotographyDto } from './dto/create-photography.dto';
import { IsPublic } from '../auth/decorators/is_public.decorator';

@Controller('photography')
export class PhotographyController {
  constructor(private readonly photographyService: PhotographyService) {}
  @Post()
  @IsPublic()
  create(@Body() createPhotographyDto: CreatePhotographyDto) {
    return this.photographyService.create(createPhotographyDto);
  }

  @Get()
  findAll() {
    return this.photographyService.findAll();
  }
}
