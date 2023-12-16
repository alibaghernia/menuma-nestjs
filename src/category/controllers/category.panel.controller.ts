import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { SessionGuard } from 'src/auth/guards';
import { CreateCategoryDTO } from '../dto';
import { CategoryPanelService } from '../services/category.panel.service';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { UpdateCategoryDTO } from '../dto/update.dto';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { category_permissions } from 'src/access_control/constants';

@Controller(':business_uuid/panel/category')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class CategoryPanelController {
  constructor(private categoryPanelService: CategoryPanelService) {}

  @Get()
  @CheckPermissions([category_permissions.read.action])
  async getCategories(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
  ) {
    try {
      const categories =
        await this.categoryPanelService.fetchAll(business_uuid);
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
  async createCategory(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Body() payload: CreateCategoryDTO,
  ) {
    try {
      await this.categoryPanelService.create(business_uuid, payload);
      return {
        ok: true,
        message: 'Category created successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':category_uuid')
  @CheckPermissions([category_permissions.updateCategory.action])
  async updateCategory(
    @Param('category_uuid', new UUIDChecker('Category UUID'))
    category_uuid: string,
    @Body() payload: UpdateCategoryDTO,
  ) {
    try {
      await this.categoryPanelService.update(category_uuid, payload);
      return {
        ok: true,
        message: 'Category updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  //TODO: fix delete
  @Delete(':category_uuid')
  @CheckPermissions([category_permissions.deleteCategory.action])
  async removeCategory(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('category_uuid', new UUIDChecker('Category UUID'))
    category_uuid: string,
  ) {
    try {
      await this.categoryPanelService.remove(business_uuid, category_uuid);
      return {
        ok: true,
        message: 'Category removed successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
