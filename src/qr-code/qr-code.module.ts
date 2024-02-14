import { Module } from '@nestjs/common';
import { QrCodeController } from './controllers/qr-code.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { QrCode } from './enitites/qr-code.entity';
import { QrCodeService } from './services/qr-code.service';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { QrCodePanelService } from './services/qr-code.panel.service';
import { QrCodePanelController } from './controllers/qr-code.panel.controller';

@Module({
  imports: [SequelizeModule.forFeature([QrCode]), AccessControlModule],
  controllers: [QrCodeController, QrCodePanelController],
  providers: [QrCodeService, QrCodePanelService],
  exports: [QrCodePanelService],
})
export class QrCodeModule {}
