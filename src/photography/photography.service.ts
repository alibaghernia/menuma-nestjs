import { Injectable } from '@nestjs/common';
import { CreatePhotographyDto } from './dto/create-photography.dto';
import { InjectModel } from '@nestjs/sequelize';
import { PhotographyEntity } from './entities/photography.entity';

@Injectable()
export class PhotographyService {
  constructor(
    @InjectModel(PhotographyEntity)
    private photographyRepo: typeof PhotographyEntity,
  ) {}

  create(createPhotographyDto: CreatePhotographyDto) {
    return this.photographyRepo.create(createPhotographyDto);
  }

  findAll() {
    return this.photographyRepo.findAll();
  }
}
