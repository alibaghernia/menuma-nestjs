import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './entities/file.entity';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { FilesPanelService } from './services/files.panel.service';
import { Response } from 'express';

const pipe = new ParseFilePipe();

@Controller('files')
export class FilesController {
  constructor(
    @InjectModel(File) private fileRepo: typeof File,
    private filesPanelService: FilesPanelService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async newFile(@UploadedFile(pipe) file: Express.Multer.File) {
    try {
      const uuid = (await this.fileRepo.create()).uuid;
      await this.filesPanelService.minio.putObject('files', uuid, file.buffer);
      console.log('here');
      return {
        ok: true,
        data: {
          uuid,
        },
      };
    } catch (error) {
      return this.exceptionHandler(error);
    }
  }
  @IsPublic()
  @Get(':uuid')
  async redirect(@Res() res: Response, @Param('uuid') uuid) {
    try {
      const url = await this.filesPanelService.minio.presignedUrl(
        'GET',
        'files',
        uuid,
      );
      return res.redirect(url, 301);
    } catch (error: any) {
      return this.exceptionHandler(error);
    }
  }

  private exceptionHandler(error) {
    console.log({
      error,
    });
    switch (error.errno) {
      case -111: {
        throw new HttpException(
          {
            ok: false,
            message: "Couldn't connect to file server!",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      default: {
        throw new HttpException(
          {
            ok: false,
            message: 'Unknown error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
