import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessControlModule } from '../access_control/access_control.module';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Customer]), AccessControlModule],
  controllers: [],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
