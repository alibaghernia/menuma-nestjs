import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { users_permissions } from 'src/access_control/constants';
import { UsersPanelService } from '../services/users.panel.service';
import { CreateUserDTO } from '../dto/create_user.dto';
import { UpdateUserDTO } from '../dto/update_user.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';

@Controller('users')
@UseGuards(CheckPermissionsGuard)
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

  @Put(':user_uuid')
  @CheckPermissions([users_permissions.updateUser.action])
  async updateUser(
    @Param('user_uuid', new UUIDChecker('User UUID')) user_uuid: string,
    @Body() payload: UpdateUserDTO,
  ) {
    this.logger.log('Update user');
    try {
      await this.usersService.updateUser(user_uuid, payload);
      return {
        ok: true,
        message: 'User updated successfully!',
      };
    } catch (error) {
      console.log({
        error,
      });
      this.logger.log('Error while update user');
      throw error;
    }
  }

  @Delete(':user_uuid')
  @CheckPermissions([users_permissions.deleteUser.action])
  async deleteUser(
    @Param('user_uuid', new UUIDChecker('User UUID')) user_uuid: string,
  ) {
    this.logger.log('Delete user');
    try {
      await this.usersService.deleteUser(user_uuid);
      return {
        ok: true,
        message: 'User deleted successfully!',
      };
    } catch (error) {
      console.log({
        error,
      });
      this.logger.log('Error while delete user');
      throw error;
    }
  }
}
