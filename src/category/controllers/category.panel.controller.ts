import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { CreateCategoryDTO } from '../dto';
import { CategoryPanelService } from '../services/category.panel.service';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { UpdateCategoryDTO } from '../dto/update.dto';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { category_permissions } from 'src/access_control/constants';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';
import { FiltersDTO } from '../dto/filters.dto';

@Controller('panel/business/:business_uuid/category')
@UseGuards(CheckPermissionsGuard)
@UsePipes(new UUIDCheckerController('Business UUID', 'business_uuid'))
export class CategoryPanelController {
  constructor(private categoryPanelService: CategoryPanelService) {}

  @Get()
  @CheckPermissions([category_permissions.read.action])
  async getCategories(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: FiltersDTO,
  ) {
    try {
      const categories = await this.categoryPanelService.fetchAll(
        business_uuid,
        filters,
      );
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
    @Param('business_uuid')
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

  @Get(':category_uuid')
  @CheckPermissions([category_permissions.read.action])
  async getCategory(
    @Param('category_uuid', new UUIDChecker('Category UUID'))
    category_uuid: string,
  ) {
    try {
      const category = await this.categoryPanelService.findOne(category_uuid);
      return {
        ok: true,
        data: category,
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
