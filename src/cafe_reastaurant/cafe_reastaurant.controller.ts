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
  UseGuards,
} from '@nestjs/common';
import { CafeReastaurantService } from './cafe_reastaurant.service';
import { CreateCafeReastaurantDTO } from './dto';
import { SessionGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import { UpdateCafeReastaurantDTO } from './dto/update.dto';

@Controller('cafe-reastaurant')
export class CafeReastaurantController {
  constructor(private cafeReastaurantService: CafeReastaurantService) {}

  @Get()
  getAll() {
    return this.cafeReastaurantService.findAll();
  }

  @Get(':slugOrId')
  getBySlug(@Param('slugOrId') slugOrId: string) {
    return this.cafeReastaurantService.findBySlugOrId(slugOrId);
  }

  @UseGuards(SessionGuard)
  @Post('/create')
  @Roles(Role.Admin)
  async create(@Body() body: CreateCafeReastaurantDTO) {
    try {
      const cafeReastaurant = await this.cafeReastaurantService.create(
        body as unknown as Required<CreateCafeReastaurantDTO>,
      );
      return {
        ok: true,
        message: `${cafeReastaurant.name} crearted successfully!`,
      };
    } catch (error) {
      console.log({
        error,
      });
      throw new HttpException(
        'Cafe Reastaurant creation error!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    try {
      await this.cafeReastaurantService.remove(id);
      return {
        ok: true,
        message: 'Cafe reastaurant deleted successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while deleting cafe-reastaurant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCafeReastaurantDTO,
  ) {
    try {
      await this.cafeReastaurantService.update(id, payload);
      return {
        ok: true,
        message: 'cafe-reastaurant updated successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating cafe-reastaurant!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/add_user/:user_id')
  async addUser(@Param('id') id: string, @Param('user_id') user_id: string) {
    try {
      await this.cafeReastaurantService.addUser(id, user_id);
      return {
        ok: true,
        message: 'cafe-reastaurant updated successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating cafe-reastaurant!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
