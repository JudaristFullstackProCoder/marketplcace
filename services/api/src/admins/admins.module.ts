import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminSchema } from './entities/admin.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminRepository } from './admin.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'admins', schema: AdminSchema }]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService, AdminRepository],
  exports: [AdminRepository],
})
export class AdminsModule {}
