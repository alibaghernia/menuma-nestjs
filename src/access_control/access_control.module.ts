import { Module } from '@nestjs/common';
import { AccessControlPanelController } from './controllers/access_control.panel.controller';
import { AccessControlPanelService } from './services/access_control.panel.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role_permission.entity';
import { BusinessUserRole } from './entities/business-user_role.entity';
import { BusinessUserPermission } from './entities/business-user_permission.entity';
import { BusinessUser } from 'src/business/entites/business_user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Role,
      Permission,
      BusinessUser,
      RolePermission,
      BusinessUserRole,
      BusinessUserPermission,
    ]),
  ],
  controllers: [AccessControlPanelController],
  providers: [AccessControlPanelService],
  exports: [AccessControlPanelService],
})
export class AccessControlModule {}
