import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from './dto/create-customer.dto';
import { doInTransaction } from '../utils/transaction';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Customer } from './entities/customer.entity';
import { CustomersFilterDto } from './dto/filters.dto';
import { getPagination } from 'src/utils/filter';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private customerRepository: typeof Customer,

    private sequelize: Sequelize,
  ) {}

  async getAll(
    business_uuid: string,
    { search = '', ...filters }: CustomersFilterDto,
  ) {
    const { offset, limit } = getPagination(filters);
    const where: WhereOptions<Customer> = {
      business_uuid,
      [Op.or]: {
        first_name: {
          [Op.like]: `%${search}%`,
        },
        last_name: {
          [Op.like]: `%${search}%`,
        },
        mobile: {
          [Op.like]: `%${search}%`,
        },
      },
    };

    const customers = await this.customerRepository.findAll({
      where,
      offset,
      limit,
    });
    const count = await this.customerRepository.count({
      where,
    });

    return [customers, count];
  }

  get(business_uuid: string, uuid: string) {
    return this.customerRepository.findOne({
      where: {
        business_uuid,
        uuid,
      },
    });
  }

  create(payload: CreateCustomerDto) {
    return doInTransaction(this.sequelize, async (transaction) => {
      return this.customerRepository.create({ ...payload }, { transaction });
    });
  }
  update(uuid: string, payload: UpdateCustomerDto) {
    return doInTransaction(this.sequelize, async (transaction) => {
      const customer = await this.customerRepository.findOne({
        where: {
          uuid,
        },
        transaction,
      });

      if (!customer)
        throw new HttpException('Customer not found!', HttpStatus.NOT_FOUND);

      await customer.update(payload, { transaction });
    });
  }
  delete(uuid: string) {
    return doInTransaction(this.sequelize, async (transaction) => {
      const customer = await this.customerRepository.findOne({
        where: {
          uuid,
        },
        transaction,
      });

      if (!customer)
        throw new HttpException('Customer not found!', HttpStatus.NOT_FOUND);

      await customer.destroy({ transaction });
    });
  }
}
