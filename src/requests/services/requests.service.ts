import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from '../entities/request.entity';
import { CreateDTO } from '../dto/create.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request) private requestRepository: typeof Request,
  ) {}

  async create(payload: CreateDTO) {
    await this.requestRepository.create(payload);
  }
}
