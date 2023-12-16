import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';

export class UUIDCheckerController extends ParseUUIDPipe {
  protected exceptionFactory = function () {
    return new HttpException(
      `${this.name} is not a valid UUID!`,
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
      if (this.isUUID(value)) {
        return value;
      }
      throw this.exceptionFactory();
    }

    return value;
  }
}
