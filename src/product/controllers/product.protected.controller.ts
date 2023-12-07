import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { ProductService } from '../product.service';
import { CreateProductDTO } from '../dto/create.dto';

@Controller('product')
@UseGuards(SessionGuard)
export class ProductProtectedController {
  constructor(private productService: ProductService) {}

  @Post('create')
  async create(@Body() payload: CreateProductDTO) {
    try {
      await this.productService.create(payload);
    } catch (error) {
      throw error;
    }
  }
}
