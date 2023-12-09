import { FileTypeValidator } from '@nestjs/common';

export class ProductPhotoTypeValidator extends FileTypeValidator {
  buildErrorMessage(): string {
    return `Photo types must be one whether jpg, jpeg or png`;
  }
}
