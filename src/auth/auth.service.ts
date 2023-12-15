import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersPanelService } from 'src/users/services/users.panel.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersPanelService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByMobile(email);
    if (!user) throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
    const passwordMatch: boolean = await this.passwordMatch(
      password,
      user.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    return {
      uuid: user.uuid,
      email: user.email,
      fname: user.first_name,
      role: user.role,
    };
  }

  async passwordMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(): Promise<any> {
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
    };
  }

  async logout(@Req() request: Request): Promise<any> {
    //@ts-ignore
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
