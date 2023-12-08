import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { ProductService } from '../product.service';
import { CreateProductDTO } from '../dto/create.dto';
import { AccessControlService } from 'src/access_control/access_control.service';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';

@Controller('product')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class ProductProtectedController {
  constructor(
    private productService: ProductService,
    private accessControllService: AccessControlService,
  ) {}

  @Post('create')
  @CheckPermissions(['create-product'], true)
  async create(@Body() payload: CreateProductDTO) {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
