import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './controllers/product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entites/user.entity';
import { ProductProtectedController } from './controllers/product.protected.controller';

@Module({
  imports: [SequelizeModule.forFeature([Product, User])],
  providers: [ProductService],
  controllers: [ProductController, ProductProtectedController],
})
export class ProductModule {}
