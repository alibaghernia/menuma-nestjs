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
import { BusinessService } from './business.service';
import { CreateBusinessDTO } from './dto';
import { SessionGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import { UpdateBusinessDTO } from './dto/update.dto';

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get()
  getAll() {
    return this.businessService.findAll();
  }

  @Get(':slugOrId')
  getBySlug(@Param('slugOrId') slugOrId: string) {
    return this.businessService.findBySlugOrId(slugOrId);
  }

  @UseGuards(SessionGuard)
  @Post('/create')
  @Roles(Role.Admin)
  async create(@Body() body: CreateBusinessDTO) {
    try {
      const business = await this.businessService.create(
        body as unknown as Required<CreateBusinessDTO>,
      );
      return {
        ok: true,
        message: `${business.name} crearted successfully!`,
      };
    } catch (error) {
      console.log({
        error,
      });
      throw new HttpException(
        'Business creation error!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    try {
      await this.businessService.remove(id);
      return {
        ok: true,
        message: 'Business deleted successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while deleting business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateBusinessDTO) {
    try {
      await this.businessService.update(id, payload);
      return {
        ok: true,
        message: 'business updated successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating business!',
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
      await this.businessService.addUser(id, user_id, role);
      return {
        ok: true,
        message: 'business updated successfully!',
      };
    } catch (error) {
      throw error;
      // throw new HttpException(
      //   'An error occurred while updating business!',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }
}
