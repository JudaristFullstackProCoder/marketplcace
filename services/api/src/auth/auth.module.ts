import { Module } from '@nestjs/common';
import { AdminsModule } from '../admins/admins.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [UsersModule, AdminsModule, UsersModule],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
