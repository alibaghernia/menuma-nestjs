import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getMe(@Req() request: Request) {
    try {
      const me = await this.usersService.getMe(request.user.uuid!);
      return {
        ok: true,
        data: me,
      };
    } catch (error) {
      throw error;
    }
  }
}
