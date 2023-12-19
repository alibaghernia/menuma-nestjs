import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesPanelService {
  constructor(@InjectModel(File) private filesRepo: typeof File) {}

  getFileById(file_uuid: string) {
    return this.filesRepo.findOne({
      where: {
        uuid: file_uuid,
      },
    });
  }
}
