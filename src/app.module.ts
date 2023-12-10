import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { BusinessModule } from './business/business.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import typeormConfigs from 'src/database/config';
import { RolesGuard } from './auth/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { AccessControlModule } from './access_control/access_control.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { VerionController } from './verion/verion.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfigs] }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    CategoryModule,
    ProductModule,
    AccessControlModule,
    QrCodeModule,
  ],
  controllers: [VerionController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
