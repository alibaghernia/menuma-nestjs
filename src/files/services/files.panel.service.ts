import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../entities/file.entity';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class FilesPanelService {
  public minio;
  constructor(
    @InjectModel(File) private filesRepo: typeof File,
    private configService: ConfigService,
  ) {
    const S3URI = configService.get('S3_URI');
    if (!S3URI) throw new Error("S3URI env variable isn't specified!");
    const s3Uri = new URL(S3URI);
    this.minio = new Client({
      endPoint: s3Uri.hostname,
      port: s3Uri.port ? Number(s3Uri.port) : 9000,
      useSSL: s3Uri.protocol.startsWith('https'),
      accessKey: decodeURIComponent(s3Uri.username),
      secretKey: decodeURIComponent(s3Uri.password),
    });
  }

  getFileById(file_uuid: string) {
    return this.filesRepo.findOne({
      where: {
        uuid: file_uuid,
      },
    });
  }
}
