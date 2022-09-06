import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './entities/store.entity';
import { StoreRepository } from './stores.repository';
import { ShopkeepersModule } from '../shopkeepers/shopkeepers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'stores', schema: StoreSchema }]),
    ShopkeepersModule,
  ],
  controllers: [StoresController],
  providers: [StoresService, StoreRepository],
})
export class StoresModule {}
