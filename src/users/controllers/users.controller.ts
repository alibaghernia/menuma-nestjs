import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { Request } from 'express';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(SessionGuard)
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
