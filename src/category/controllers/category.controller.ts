import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { FetchCategoriesDTO } from '../dto/filters.dto';
import { CategoryService } from '../services/category.service';
import { SlugCheckerController } from 'src/pipes/slug_checker_controller.pipe';

@Controller('category/:business_slug')
@UsePipes(SlugCheckerController)
@IsPublic()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAll(
    @Param('business_slug') business_slug: string,
    @Query() filters: FetchCategoriesDTO,
  ) {
    try {
      const categories = await this.categoryService.findAll(
        business_slug,
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
  @Get(':category_uuid')
  async getOne(
    @Param('category_uuid') category_uuid: string,
    @Query('with_items') with_items?: string,
  ) {
    try {
      const category = await this.categoryService.findByUUID(
        category_uuid,
        with_items == 'true' || with_items == '1',
      );

      return {
        ok: true,
        data: category,
      };
    } catch (error) {
      throw error;
    }
  }
}
