import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FamilySchema } from './entities/family.entity';
import { FamilyRepository } from './family.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'families', schema: FamilySchema }]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamilyRepository],
})
export class FamiliesModule {}
