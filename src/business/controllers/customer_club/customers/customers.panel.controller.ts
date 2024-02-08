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
import { QueryError } from 'sequelize';
import { CheckBusinessAccessGuard } from 'src/access_control/guards/check_buisness_access.guard';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { CustomerClubCreateDTO } from 'src/business/dto';
import { CustomerClubUpdateDTO } from 'src/business/dto/update.dto';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { CustomersService } from 'src/customers/customers.service';
import { CustomersFilterDto } from 'src/customers/dto/filters.dto';
@Controller('panel/business/:business_uuid/customer_club/customers')
@UseGuards(
  CheckBusinessExistsGuard,
  CheckBusinessAccessGuard,
  CheckPermissionsGuard,
)
export class CustomersPanelController {
  constructor(private customersService: CustomersService) {}

  @Get()
  async getAll(
    @Param('business_uuid') business_uuid: string,
    @Query() filters: CustomersFilterDto,
  ) {
    const [customers, total] = await this.customersService.getAll(
      business_uuid,
      filters,
    );
    return {
      ok: true,
      data: {
        customers,
        total,
      },
    };
  }
  @Get(':customer_uuid')
  async get(
    @Param('business_uuid') business_uuid: string,
    @Param('customer_uuid') customer_uuid: string,
  ) {
    const customer = await this.customersService.get(
      business_uuid,
      customer_uuid,
    );
    return {
      ok: true,
      data: customer,
    };
  }
  @Post()
  async create(
    @Param('business_uuid') business_uuid: string,
    @Body() body: CustomerClubCreateDTO,
  ) {
    try {
      await this.customersService.create({ business_uuid, ...body });
      return {
        ok: true,
        message: 'Customer created successfully!',
      };
    } catch (error) {
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            code: 1,
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  @Put(':customer_uuid')
  async update(
    @Param('customer_uuid') customer_uuid: string,
    @Body() body: CustomerClubUpdateDTO,
  ) {
    try {
      await this.customersService.update(customer_uuid, body);
      return {
        ok: true,
        message: 'Customer updated successfully!',
      };
    } catch (error) {
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            code: 1,
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  @Delete(':customer_uuid')
  async delete(@Param('customer_uuid') customer_uuid: string) {
    await this.customersService.delete(customer_uuid);
    return {
      ok: true,
      message: 'Customer deleted successfully!',
    };
  }
}
