import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OptioneSchema } from './entities/option.entity';
import { OptionRepository } from './option.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'options', schema: OptioneSchema }]),
  ],
  controllers: [OptionsController],
  providers: [OptionsService, OptionRepository],
})
export class OptionsModule {}
