import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from './product.repository';
import { productSchema } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { productViewerSchema } from './entities/product-viewers.entity';
import { productLikesSchema } from './entities/product-like.entity';
import { ProductViewersRepository } from './products-viewers.repository';
import { ProductLikesRepository } from './products-like.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'products', schema: productSchema }]),
    MongooseModule.forFeature([
      { name: 'products_likes', schema: productLikesSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'products_viewers', schema: productViewerSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    ProductViewersRepository,
    ProductLikesRepository,
  ],
})
export class ProductsModule {}
