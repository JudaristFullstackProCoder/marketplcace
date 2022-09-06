import { Module } from '@nestjs/common';
import { VariationsService } from './variations.service';
import { VariationsController } from './variations.controller';
import { VariationRepository } from './variation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { variationSchema } from './entities/variation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'variations', schema: variationSchema },
    ]),
  ],
  controllers: [VariationsController],
  providers: [VariationsService, VariationRepository],
})
export class VariationsModule {}
