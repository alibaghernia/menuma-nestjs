import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { SlugCheckerController } from 'src/pipes/slug_checker_controller.pipe';
import { FetchAllProductsDTO } from '../dto/filters.dto';
import { ProductService } from '../services/product.service';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';

@Controller('product')
@UsePipes(SlugCheckerController)
@IsPublic()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async fetchAll(
    @Param('business_slug') business_slug: string,
    @Query() filters: FetchAllProductsDTO,
  ) {
    try {
      const products = await this.productService.fetchAll(
        business_slug,
        filters,
      );

      return {
        ok: true,
        data: products,
      };
    } catch (error) {
      throw error;
    }
  }
  @Get(':product_uuid')
  async fetchOne(
    @Param('product_uuid') product_uuid: string,
    @Query('with_categories') with_categories: string,
  ) {
    try {
      const product = await this.productService.fetchOne(
        product_uuid,
        with_categories == '1' || with_categories == 'true',
      );

      return {
        ok: true,
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }
  @Get('category/:category_uuid')
  async fetchCategoryProducts(@Param('category_uuid') category_uuid: string) {
    try {
      const products =
        await this.productService.fetchCategoryProducts(category_uuid);

      return {
        ok: true,
        data: products,
      };
    } catch (error) {
      throw error;
    }
  }
}
