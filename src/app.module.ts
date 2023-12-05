import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CafeReastaurantModule } from './cafe_reastaurant/cafe_reastaurant.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import typeormConfigs from 'src/database/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfigs] }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CafeReastaurantModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [],
})
export class AppModule {}
