import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { BusinessModule } from './business/business.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import typeormConfigs from 'src/database/config';
import { AccessControlModule } from './access_control/access_control.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { FileModule } from './files/files.module';
import { EventModule } from './event/event.module';
import { PhotographyModule } from './photography/photography.module';
import { WebPushModule } from './web_push/web_push.module';
import { VersionController } from './version/version.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfigs] }),
    WebPushModule.register(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    CategoryModule,
    ProductModule,
    AccessControlModule,
    QrCodeModule,
    FileModule,
    EventModule,
    PhotographyModule,
  ],
  controllers: [VersionController],
})
export class AppModule {}
