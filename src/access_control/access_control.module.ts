import { Module } from '@nestjs/common';
import { AccessControlController } from './access_control.controller';
import { AccessControlService } from './access_control.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role_permission.entity';
import { BusinessUserRole } from './entities/business-user_role.entity';
import { BusinessUserPermission } from './entities/business-user_permission.entity';
import { User } from 'src/users/entites/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Role,
      User,
      Permission,
      RolePermission,
      BusinessUserRole,
      BusinessUserPermission,
    ]),
  ],
  controllers: [AccessControlController],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class AccessControlModule {}
