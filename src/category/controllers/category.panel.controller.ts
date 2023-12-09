import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { SessionGuard } from 'src/auth/guards';
import { CreateCategoryDTO } from '../dto';
import { CategoryPanelService } from '../services/category.panel.service';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';

@Controller(':business_uuid/panel/category')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class CategoryPanelController {
  constructor(private categoryPanelService: CategoryPanelService) {}

  @Get()
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
}
