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

const pipe = new ParseFilePipe();

@Controller('files')
export class FilesController {
  constructor(@InjectModel(File) private fileRepo: typeof File) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async newFile(@UploadedFile(pipe) file: Express.Multer.File) {
    const id = (await this.fileRepo.create()).uuid;
    await minio.putObject('files', id, file.buffer);
    return { id };
  }
  @Get(':id')
  async redirect(@Res() res, @Param('id') id) {
    const url = await minio.presignedUrl('GET', 'files', id);
    return res.redirect(url, 301);
  }
}
