import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SessionGuard } from 'src/auth/guards';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get()
  findAll() {
    return this.usersService.fetchAll();
  }
}
