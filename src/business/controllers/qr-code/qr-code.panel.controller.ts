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
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CreateDTO, UpdateDTO } from 'src/qr-code/dto/create.dto';
import { GetAllDTO } from 'src/qr-code/dto/retrieve.dto';
import { QrCodePanelService } from 'src/qr-code/services/qr-code.panel.service';

@Controller('panel/business/:business_uuid/qr-code')
@UseGuards(
  CheckBusinessExistsGuard,
  CheckBusinessAccessGuard,
  CheckPermissionsGuard,
)
export class QrCodePanelController {
  constructor(private qrCodePanelService: QrCodePanelService) {}

  @Get()
  async fetchAll(
    @Param('business_uuid')
    business_uuid: string,
    @Query() filters: GetAllDTO,
  ) {
    try {
      const [items, total] = await this.qrCodePanelService.getAll({
        business_uuid,
        ...filters,
      });
      return {
        ok: true,
        data: {
          items,
          total,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  @Get(':uuid')
  async get(
    @Param('uuid', new UUIDChecker('QrCode uuid'))
    uuid: string,
  ) {
    try {
      const item = await this.qrCodePanelService.get(uuid);
      return {
        ok: true,
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }
  @Get(':uuid/data')
  async getData(
    @Param('uuid', new UUIDChecker('QrCode uuid'))
    uuid: string,
  ) {
    try {
      const item = await this.qrCodePanelService.getData(uuid);
      return {
        ok: true,
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(
    @Param('business_uuid')
    business_uuid: string,
    @Body() payload: CreateDTO,
  ) {
    try {
      const qrCode = await this.qrCodePanelService.create({
        business_uuid,
        ...payload,
      });
      return {
        ok: true,
        message: 'Qr Code created successfully!',
        data: {
          uuid: qrCode.uuid,
        },
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
  @Put(':qr_code_uuid')
  async update(
    @Param('qr_code_uuid')
    qr_code_uuid: string,
    @Body() payload: UpdateDTO,
  ) {
    try {
      await this.qrCodePanelService.update(qr_code_uuid, payload);
      return {
        ok: true,
        message: 'Qr Code updated successfully!',
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
  @Delete(':qr_code_uuid')
  async delete(
    @Param('qr_code_uuid')
    qr_code_uuid: string,
  ) {
    try {
      await this.qrCodePanelService.delete(qr_code_uuid);
      return {
        ok: true,
        message: 'Qr Code deleted successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
