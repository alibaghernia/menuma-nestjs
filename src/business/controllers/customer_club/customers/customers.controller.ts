import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { CustomerClubCreateDTO } from 'src/business/dto';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { CustomersService } from 'src/customers/customers.service';
@Controller('business/:business_slug/customer_club/customers')
@UseGuards(CheckBusinessExistsGuard)
@IsPublic()
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: CustomerClubCreateDTO) {
    await this.customersService.create({
      business_uuid: req.business_guard?.uuid,
      ...body,
    });
    return {
      ok: true,
      message: 'Customer created successfully!',
    };
  }
}
