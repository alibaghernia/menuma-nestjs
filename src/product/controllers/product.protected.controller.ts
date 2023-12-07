import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { ProductService } from '../product.service';
import { CreateProductDTO } from '../dto/create.dto';
import { AccessControlService } from 'src/access_control/access_control.service';
import { Request } from 'express';
@Controller('product')
@UseGuards(SessionGuard)
export class ProductProtectedController {
  constructor(
    private productService: ProductService,
    private accessControllService: AccessControlService,
  ) {}

  @Post('create')
  async create(@Body() payload: CreateProductDTO, @Req() req: Request) {
    try {
      await this.accessControllService.checkUserPermission(
        { action: 'create-product' },
        payload.business_uuid,
        req.user.uuid,
      );

      await this.productService.create(payload);
    } catch (error) {
      throw error;
    }
  }
}
