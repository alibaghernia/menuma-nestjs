import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CafeReastaurantService } from './cafe_reastaurant.service';
import { CreateCafeReastaurantDTO } from './dto';
import { SessionGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('cafe-reastaurant')
@UseGuards(RolesGuard)
export class CafeReastaurantController {
  constructor(private cafeReastaurantService: CafeReastaurantService) {}

  @Get()
  getAll() {
    return this.cafeReastaurantService.findAll();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.cafeReastaurantService.findBySlug(slug);
  }

  @Post('/create')
  @UseGuards(SessionGuard)
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
}
