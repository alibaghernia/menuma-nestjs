import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CafeRestaurantService } from './cafe_restaurant.service';
import { CreateCafeRestaurantDTO } from './dto';
import { SessionGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import { UpdateCafeRestaurantDTO } from './dto/update.dto';

@Controller('cafe-restaurant')
export class CafeRestaurantController {
  constructor(private cafeRestaurantService: CafeRestaurantService) {}

  @Get()
  getAll() {
    return this.cafeRestaurantService.findAll();
  }

  @Get(':slugOrId')
  getBySlug(@Param('slugOrId') slugOrId: string) {
    return this.cafeRestaurantService.findBySlugOrId(slugOrId);
  }

  @UseGuards(SessionGuard)
  @Post('/create')
  @Roles(Role.Admin)
  async create(@Body() body: CreateCafeRestaurantDTO) {
    try {
      const cafeRestaurant = await this.cafeRestaurantService.create(
        body as unknown as Required<CreateCafeRestaurantDTO>,
      );
      return {
        ok: true,
        message: `${cafeRestaurant.name} crearted successfully!`,
      };
    } catch (error) {
      console.log({
        error,
      });
      throw new HttpException(
        'Cafe Restaurant creation error!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    try {
      await this.cafeRestaurantService.remove(id);
      return {
        ok: true,
        message: 'Cafe restaurant deleted successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while deleting cafe-restaurant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCafeRestaurantDTO,
  ) {
    try {
      await this.cafeRestaurantService.update(id, payload);
      return {
        ok: true,
        message: 'cafe-restaurant updated successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating cafe-restaurant!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/add_user/:user_id')
  async addUser(
    @Param('id') id: string,
    @Param('user_id') user_id: string,
    @Query('role') role: any,
  ) {
    try {
      await this.cafeRestaurantService.addUser(id, user_id, role);
      return {
        ok: true,
        message: 'cafe-restaurant updated successfully!',
      };
    } catch (error) {
      throw error;
      // throw new HttpException(
      //   'An error occurred while updating cafe-restaurant!',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }
}
