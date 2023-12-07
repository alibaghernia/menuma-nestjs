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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfigs] }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
