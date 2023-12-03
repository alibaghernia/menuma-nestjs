import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
}
