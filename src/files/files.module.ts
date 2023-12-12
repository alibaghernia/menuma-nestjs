import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './entities/file.entity';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [FilesController],
})
export class FileModule {}
