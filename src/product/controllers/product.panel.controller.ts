import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards';
import { ProductPanelService } from '../services/product.panel.service';
import { CreateProductDTO } from '../dto/create.dto';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { product_permissions } from 'src/access_control/constants';
import { FindProductFiltersDTO } from '../dto/query.dto';

@Controller(':business_uuid/panel/product')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class ProductPanelController {
  private logger = new Logger('ProductController');
  constructor(private productService: ProductPanelService) {}

  @Get(':uuid')
  @CheckPermissions([product_permissions.readProducts.action])
  async findOneByUuid(
    @Param('business_uuid') business_uuid: string,
    @Param('uuid') uuid: string,
  ) {
    this.logger.log('get product');
    try {
      const product = await this.productService.findOneByUuid(
        business_uuid,
        uuid,
      );

      return {
        ok: true,
        data: product,
      };
    } catch (error) {
      this.logger.log('Error during get product');
      throw error;
    }
  }
  @Get('single')
  @CheckPermissions([product_permissions.readProducts.action])
  async findOne(
    @Param('business_uuid') business_uuid: string,
    @Body() filters: FindProductFiltersDTO,
  ) {
    this.logger.log('get product');
    try {
      const product = await this.productService.findOne(business_uuid, filters);

      return {
        ok: true,
        data: product,
      };
    } catch (error) {
      this.logger.log('Error during get product');
      throw error;
    }
  }
  @Get()
  @CheckPermissions([product_permissions.readProducts.action])
  async findAll(
    @Param('business_uuid') business_uuid: string,
    @Body() filter: FindProductFiltersDTO,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    this.logger.log('get products');
    try {
      const products = await this.productService.fetchAll(
        business_uuid,
        {
          page,
          limit,
        },
        filter,
      );

      return {
        ok: true,
        data: products,
      };
    } catch (error) {
      this.logger.log('Error during get products');
      throw error;
    }
  }
  @Post()
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
  @Put(':uuid')
  @CheckPermissions([product_permissions.createProduct.action])
  async update(
    @Param('uuid') product_uuid: string,
    @Body() payload: CreateProductDTO,
  ) {
    this.logger.log('update product');
    try {
      await this.productService.update(product_uuid, payload);

      return {
        ok: true,
        message: 'Product updated successfully!',
      };
    } catch (error) {
      this.logger.log('Error during updated product');
      throw error;
    }
  }
  @Delete(':uuid')
  @CheckPermissions([product_permissions.deleteProduct.action])
  async delete(
    @Param('business_uuid') business_uuid: string,
    @Param('uuid') uuid: string,
  ) {
    this.logger.log('delete product');
    try {
      await this.productService.delete(business_uuid, uuid);

      return {
        ok: true,
        message: 'Product deleted successfully!',
      };
    } catch (error) {
      this.logger.log('Error during delete product');
      throw error;
    }
  }
}
