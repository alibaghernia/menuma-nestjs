import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { doInTransaction } from '../transaction';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private customerRepository: typeof Customer,

    private sequelize: Sequelize,
  ) {}

  create(payload: CreateCustomerDto) {
    return doInTransaction(this.sequelize, async (transaction) => {
      return this.customerRepository.create({ ...payload }, { transaction });
    });
  }
}
