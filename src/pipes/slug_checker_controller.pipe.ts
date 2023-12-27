import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

export class SlugCheckerController extends ValidationPipe {
  protected exceptionFactory = function () {
    return new HttpException(
      `${this.name} is not a valid slug!`,
      HttpStatus.BAD_REQUEST,
    );
  };
  constructor(
    private name: string,
    private param_name: string,
  ) {
    super();
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (metadata.type == 'param' && metadata.data == this.param_name) {
      if (value) {
        return value;
      }
      throw this.exceptionFactory();
    }

    return value;
  }
}
