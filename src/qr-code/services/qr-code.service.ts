import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QrCode } from '../enitites/qr-code.entity';

@Injectable()
export class QrCodeService {
  constructor(@InjectModel(QrCode) private qrCodeRepo: typeof QrCode) {}

  async handleQrCode(slug: string) {
    const qrCode = await this.qrCodeRepo.findOne({
      where: {
        slug,
      },
    });

    if (!qrCode)
      throw new HttpException('qr-code not found!', HttpStatus.NOT_FOUND);

    return qrCode;
  }
}
