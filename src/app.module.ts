import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import typeormConfigs from 'src/database/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeormConfigs] }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
})
export class AppModule {}
