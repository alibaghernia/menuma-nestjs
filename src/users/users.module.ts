import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers';
import { User } from './entites/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersPanelController } from './controllers/users.panel.controller';
import { UsersPanelService } from './services/users.panel.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, UsersPanelService],
  controllers: [UsersController, UsersPanelController],
  exports: [UsersService, UsersPanelService],
})
export class UsersModule {}
