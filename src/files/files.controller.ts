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
import { minio } from './minio';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './entities/file.entity';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';

const pipe = new ParseFilePipe();

@Controller('files')
export class FilesController {
  constructor(@InjectModel(File) private fileRepo: typeof File) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async newFile(@UploadedFile(pipe) file: Express.Multer.File) {
    try {
      const uuid = (await this.fileRepo.create()).uuid;
      await minio.putObject('files', uuid, file.buffer);
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
    const url = await minio.presignedUrl('GET', 'files', uuid);
    return res.redirect(url, 301);
  }
}
