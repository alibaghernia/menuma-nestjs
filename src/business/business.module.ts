import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './entites/business.entity';
import { Social } from 'src/database/entities/social.entity';
import { User } from 'src/users/entites/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Business, Social, User])],
  providers: [BusinessService],
  controllers: [BusinessController],
})
export class BusinessModule {}
