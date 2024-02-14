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
import { QrCodePanelService } from '../services/qr-code.panel.service';
import { CreateDTO } from '../dto/create.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { GetAllDTO } from '../dto/retrieve.dto';
import { IsAdmin } from 'src/auth/decorators/is_public.decorator';

@Controller('/panel/qr-code')
@IsAdmin()
export class QrCodePanelController {
  constructor(private qrCodePanelService: QrCodePanelService) {}

  @Get()
  async fetchAll(@Query() filters: GetAllDTO) {
    try {
      const [items, total] = await this.qrCodePanelService.getAll(filters);
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

  @Post()
  async create(@Body() payload: CreateDTO) {
    try {
      const qrCode = await this.qrCodePanelService.create(payload);
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
  @Put(':uuid')
  async update(
    @Param('uuid', new UUIDChecker('Qr Code uuid'))
    uuid: string,
    @Body() payload: CreateDTO,
  ) {
    try {
      await this.qrCodePanelService.update(uuid, payload);
      return {
        ok: true,
        message: 'Qr Code updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
  @Delete(':uuid')
  async delete(
    @Param('uuid', new UUIDChecker('Qr Code uuid'))
    uuid: string,
  ) {
    try {
      await this.qrCodePanelService.delete(uuid);
      return {
        ok: true,
        message: 'Qr Code deleted successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
