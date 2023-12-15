import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { users_permissions } from 'src/access_control/constants';
import { UsersPanelService } from '../services/users.panel.service';
import { CreateUserDTO } from '../dto/create_user.dto';

@Controller('users')
@UseGuards(SessionGuard)
export class UsersPanelController {
  logger = new Logger(UsersPanelController.name);
  constructor(private usersService: UsersPanelService) {}

  @Get()
  @CheckPermissions([users_permissions.readUsers.action])
  findAll() {
    return this.usersService.fetchAll();
  }

  @Get('/managers')
  @CheckPermissions([users_permissions.readUsers.action])
  async getManagers() {
    const managers = await this.usersService.getAllManagers();
    return {
      ok: true,
      data: managers,
    };
  }

  @Post()
  @CheckPermissions([users_permissions.createUser.action])
  async createUser(@Body() payload: CreateUserDTO) {
    this.logger.log('Create new user');
    try {
      await this.usersService.createUser(payload);
      return {
        ok: true,
        message: 'User has created successfully!',
      };
    } catch (error) {
      console.log({
        error,
      });
      this.logger.log('Error while create new user');
      throw error;
    }
  }
}
