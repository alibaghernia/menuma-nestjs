import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseProvider } from './providers/typeorm.provider';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [],
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class AppModule {}
