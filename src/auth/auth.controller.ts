import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login';
import { IsPublic } from './decorators/is_public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
