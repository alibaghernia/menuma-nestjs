import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  business_permissions,
  discount_permissions,
} from 'src/access_control/constants';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { CheckBusinessAccessGuard } from 'src/access_control/guards/check_buisness_access.guard';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { Request } from 'express';
import { DiscountsPanelService } from 'src/discounts/services/discounts.panel.service';
import { CreateDTO, FiltersDTO, UpdateDTO } from 'src/discounts/dto';

const permissions = {
  ...business_permissions.manageBusinessDiscounts,
  ...discount_permissions,
};
@Controller('panel/business/:business_uuid/discounts')
@UseGuards(
  CheckBusinessExistsGuard,
  CheckBusinessAccessGuard,
  CheckPermissionsGuard,
)
export class DiscountsPanelController {
  constructor(private discountsPanelService: DiscountsPanelService) {}
  @Get(':uuid')
  @CheckPermissions([permissions.action, permissions.read.action])
  async get(
    @Param('uuid', new UUIDChecker('Discount UUID'))
    uuid: string,
  ) {
    const item = await this.discountsPanelService.get(uuid);
    return {
      ok: true,
      data: item,
    };
  }

  @Get()
  @CheckPermissions([permissions.action, permissions.read.action])
  async getAll(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: FiltersDTO,
  ) {
    const items = await this.discountsPanelService.getAll(
      business_uuid,
      filters,
    );
    return {
      ok: true,
      data: items,
    };
  }

  @Post()
  @CheckPermissions([permissions.action, permissions.create.action])
  async create(@Req() request: Request, @Body() payload: CreateDTO) {
    await this.discountsPanelService.create(
      request.business_guard.uuid,
      payload,
    );
    return {
      ok: true,
      message: 'item added successfully!',
    };
  }

  @Delete(':uuid')
  @CheckPermissions([permissions.action, permissions.delete.action])
  async remove(
    @Param('uuid', new UUIDChecker('Discount UUID'))
    uuid: string,
  ) {
    await this.discountsPanelService.remove(uuid);
    return {
      ok: true,
      message: 'item removed successfully!',
    };
  }

  @Put(':uuid')
  @CheckPermissions([permissions.action, permissions.update.action])
  async update(
    @Param('uuid', new UUIDChecker('Discount UUID'))
    uuid: string,
    @Body() payload: UpdateDTO,
  ) {
    await this.discountsPanelService.update(uuid, payload);
    return {
      ok: true,
      message: 'item updated successfully!',
    };
  }
}
