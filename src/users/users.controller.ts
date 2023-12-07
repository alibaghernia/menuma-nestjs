import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SessionGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get()
  findAll() {
    return this.usersService.fetchAll();
  }

  @Get('/managers')
  @Roles(Role.Admin)
  async getManagers() {
    const managers = await this.usersService.getAllManagers();
    return {
      ok: true,
      data: managers,
    };
  }
}
