import { Module } from '@nestjs/common';
import { PhotographyService } from './photography.service';
import { PhotographyController } from './photography.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessControlModule } from '../access_control/access_control.module';
import { PhotographyEntity } from "./entities/photography.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([PhotographyEntity]),
    AccessControlModule,
  ],
  controllers: [PhotographyController],
  providers: [PhotographyService],
})
export class PhotographyModule {}
