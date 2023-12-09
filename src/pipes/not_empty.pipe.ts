import { HttpException, HttpStatus, PipeTransform } from '@nestjs/common';

export class NotEmptyPipe implements PipeTransform {
  constructor(private name: string) {}
  transform(value: string) {
    if (!value)
      throw new HttpException(
        `${this.name} musn't be empty!`,
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }
}
