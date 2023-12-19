import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './entities/file.entity';
import { FilesPanelService } from './services/files.panel.service';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesPanelService],
  exports: [FilesPanelService],
})
export class FileModule {}
