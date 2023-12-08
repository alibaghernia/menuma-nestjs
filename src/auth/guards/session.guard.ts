import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    console.log('SessionGuard');
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
