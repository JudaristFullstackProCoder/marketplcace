import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartsRepository } from './cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { cartsSchema } from './entities/cart.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'carts', schema: cartsSchema }]),
    UsersModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepository],
})
export class CartsModule {}
