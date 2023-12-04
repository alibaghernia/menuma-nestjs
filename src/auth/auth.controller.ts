import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('logout')
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(): Promise<any> {
    return this.authService.login();
  }
}
