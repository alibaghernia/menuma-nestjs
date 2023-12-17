import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDTO } from './dto/login';
import { IsPublic } from './decorators/is_public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('logout')
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loadingPayload: LoginDTO): Promise<any> {
    return this.authService.login(
      loadingPayload.mobile,
      loadingPayload.password,
    );
  }
}
