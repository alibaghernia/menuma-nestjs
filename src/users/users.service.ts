import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  fetchAll() {
    return this.userRepository.find();
  }

  fetchOne(where: FindOptionsWhere<User>) {
    return this.userRepository.findOne({
      where,
    });
  }
}
