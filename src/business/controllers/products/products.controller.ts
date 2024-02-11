import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { ProductService } from 'src/product/services/product.service';

@Controller('business/:business_slug/products')
@UseGuards(CheckBusinessExistsGuard)
@IsPublic()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('offers')
  async offers() {
    const [items, total] = await this.productService.offers();

    return {
      ok: true,
      data: {
        items,
        total,
      },
    };
  }

  @Get(':uuid')
  async get(@Param('uuid', new UUIDChecker('Product UUID')) uuid: string) {
    const item = await this.productService.fetchOne(uuid);

    return {
      ok: true,
      data: item,
    };
  }
}
