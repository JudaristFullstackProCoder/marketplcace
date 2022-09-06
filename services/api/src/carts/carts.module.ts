import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CartsRepository } from './cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { cartsSchema } from './entities/cart.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'carts', schema: cartsSchema }]),
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepository],
})
export class CartsModule {}
