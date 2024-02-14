import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { category_permissions } from 'src/access_control/constants';
import { IsAdmin } from 'src/auth/decorators/is_public.decorator';
import { CategoryPanelService } from '../services/category.panel.service';
import { FiltersDTO } from '../dto/filters.dto';
import { CreateAdminDTO } from '../dto/admin_panel.dto';

@Controller('panel/category')
@IsAdmin()
export class CategoryPanelController {
  constructor(private categoryPanelService: CategoryPanelService) {}

  @Get()
  @CheckPermissions([category_permissions.read.action])
  async getCategories(@Query() filters: FiltersDTO) {
    try {
      const categories = await this.categoryPanelService.fetchAll(filters);
      return {
        ok: true,
        data: categories,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @CheckPermissions([category_permissions.createCategory.action])
  async createCategory(@Body() payload: CreateAdminDTO) {
    try {
      const category = await this.categoryPanelService.create(payload);
      return {
        ok: true,
        message: 'Category created successfully!',
        data: {
          uuid: category.uuid,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':uuid')
  @CheckPermissions([category_permissions.read.action])
  async getCategory(
    @Param('uuid', new UUIDChecker('Category UUID'))
    uuid: string,
  ) {
    try {
      const category = await this.categoryPanelService.findOne(uuid);
      return {
        ok: true,
        data: category,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':uuid')
  @CheckPermissions([category_permissions.updateCategory.action])
  async updateCategory(
    @Param('uuid', new UUIDChecker('Category UUID'))
    uuid: string,
    @Body() payload: CreateAdminDTO,
  ) {
    try {
      await this.categoryPanelService.update(uuid, payload);
      return {
        ok: true,
        message: 'Category updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  //TODO: fix delete
  @Delete(':uuid')
  @CheckPermissions([category_permissions.deleteCategory.action])
  async removeCategory(
    @Param('uuid', new UUIDChecker('Category UUID'))
    uuid: string,
  ) {
    try {
      await this.categoryPanelService.remove(uuid);
      return {
        ok: true,
        message: 'Category removed successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
