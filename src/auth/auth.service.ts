import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersPanelService } from 'src/users/services/users.panel.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersPanelService,
    private jwtService: JwtService,
  ) {}

  async validateUser(mobile: string, password: string): Promise<any> {
    const user = await this.userService.findByMobile(mobile);
    if (!user) throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
    const passwordMatch: boolean = await this.passwordMatch(
      password,
      user.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);

    return {
      uuid: user.uuid,
      role: user.role,
    };
  }

  async passwordMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(mobile: string, password: string): Promise<any> {
    const userPayload = await this.validateUser(mobile, password);
    return {
      ok: true,
      data: {
        access_token: await this.jwtService.signAsync(userPayload),
      },
    };
  }

  async logout(@Req() request: Request): Promise<any> {
    //@ts-ignore
  }
}
