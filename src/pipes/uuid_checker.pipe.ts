import { HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';

export class UUIDChecker extends ParseUUIDPipe {
  protected exceptionFactory = function () {
    return new HttpException(
      `${this.name} is invalid!`,
      HttpStatus.BAD_REQUEST,
    );
  };
  constructor(private name: string) {
    super();
  }
}
