import { MaxFileSizeValidator } from '@nestjs/common';

export class ProductPhotoSizeValidator extends MaxFileSizeValidator {
  buildErrorMessage(): string {
    return `Photo size must be less than 2MB`;
  }
}
