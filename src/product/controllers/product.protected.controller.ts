import {
  Body,
  Controller,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { ProductService } from '../product.service';
import { CreateProductDTO } from '../dto/create.dto';
import { AccessControlService } from 'src/access_control/access_control.service';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { product_permissions } from 'src/access_control/constants';

@Controller(':business_uuid/product')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class ProductProtectedController {
  private logger = new Logger('ProductController');
  constructor(
    private productService: ProductService,
    private accessControllService: AccessControlService,
  ) {}

  @Post('create')
  @CheckPermissions([product_permissions.createProduct.action])
  async create(
    @Param('business_uuid') business_uuid: string,
    @Body() payload: CreateProductDTO,
  ) {
    this.logger.log('create new product');
    try {
      await this.productService.create(business_uuid, payload);

      return {
        ok: true,
        message: 'Product created successfully!',
      };
    } catch (error) {
      this.logger.log('Error during create new product');
      throw error;
    }
  }
}
