import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QrCodePanelService } from '../services/qr-code.panel.service';
import { CreateQrCodeDTO } from '../dto/create.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { UpdateQrCodeDTO } from '../dto/update.dto';

@Controller('/panel/business/:business_uuid/qr-code')
export class QrCodePanelController {
  constructor(
    private qrCodePanelService: QrCodePanelService,
    private configService: ConfigService,
  ) {}

  @Get()
  async fetchAll(
    @Param('business_uuid', new UUIDChecker('Business uuid'))
    business_uuid: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const qrCodes = await this.qrCodePanelService.fetchAll(business_uuid, {
        page,
        limit,
      });
      return {
        ok: true,
        data: qrCodes,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(
    @Param('business_uuid', new UUIDChecker('Business uuid'))
    business_uuid: string,
    @Body() payload: CreateQrCodeDTO,
  ) {
    try {
      const qrCode = await this.qrCodePanelService.create(
        business_uuid,
        payload,
      );
      return {
        ok: true,
        message: 'Qr Code created successfully!',
        data: {
          uuid: qrCode.uuid,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  @Put(':qr_code_uuid')
  async update(
    @Param('qr_code_uuid', new UUIDChecker('Qr Code uuid'))
    qr_code_uuid: string,
    @Body() payload: UpdateQrCodeDTO,
  ) {
    try {
      await this.qrCodePanelService.update(qr_code_uuid, payload);
      return {
        ok: true,
        message: 'Qr Code updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
  @Delete(':qr_code_uuid')
  async delete(
    @Param('qr_code_uuid', new UUIDChecker('Qr Code uuid'))
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
