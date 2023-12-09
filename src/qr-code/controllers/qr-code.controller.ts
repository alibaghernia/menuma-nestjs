import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { QrCodeService } from '../services/qr-code.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { NotEmptyPipe } from 'src/pipes/not_empty.pipe';

@Controller('q')
export class QrCodeController {
  constructor(
    private qrCodeService: QrCodeService,
    private configService: ConfigService,
  ) {}

  @Get('*')
  async handle(
    @Param('0', new NotEmptyPipe('Qr Code Slug')) slug: string,
    @Res() res: Response,
  ) {
    const qrCode = await this.qrCodeService.handleQrCode(slug);

    switch (qrCode.type) {
      case 'redirect': {
        const metadata: RedirectQrCodeMetadata = qrCode.metadata || {};

        let dest = metadata.destination;
        if (metadata.params) {
          // apply route params
          for (const [pName, pValue] of Object.entries(metadata.params)) {
            dest = dest.replaceAll(`:${pName}`, pValue);
          }
        }
        if (metadata.queryParams) {
          // add params
          const parsedQueryParams = Object.entries(metadata.queryParams).map(
            ([k, v]) => `${k}=${v}`,
          );
          dest = dest.includes('?')
            ? `${dest}&${parsedQueryParams}`
            : `${dest}?${parsedQueryParams}`;
        }
        return res
          .setHeader('Cache-Control', 'no-store')
          .redirect(HttpStatus.PERMANENT_REDIRECT, dest);
        break;
      }
    }
  }
}
