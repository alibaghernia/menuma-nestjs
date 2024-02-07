import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessControlModule } from '../access_control/access_control.module';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [SequelizeModule.forFeature([Customer]), AccessControlModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
