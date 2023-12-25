import {
  Controller,
  Get,
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
      return {
        ok: true,
        data: {
          uuid,
        },
      };
    } catch (error) {
      console.log({
        error,
      });
    }
  }
  @IsPublic()
  @Get(':uuid')
  async redirect(@Res() res, @Param('uuid') uuid) {
    const url = await this.filesPanelService.minio.presignedUrl(
      'GET',
      'files',
      uuid,
    );
    return res.redirect(url, 301);
  }
}
