import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import UsersRepository from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from '../admins/admin.repository';
import {
  SUPER_ADMIN_EMAIL_HASH,
  SUPER_ADMIN_PASSWORD_HASH,
} from '../superadmin/credentials';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(AdminRepository) private adminRepository: AdminRepository,
  ) {}

  async loginUser(email: string, password: string) {
    try {
      const user = await this.usersRepository
        .getModel()
        .findOne({
          email: email,
        })
        .exec();
      if (!user) {
        return new NotFoundException('This email is not liked to any account');
      }
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
        return new UnauthorizedException('Invalid Credentials');
      }
      return user;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async loginAdmin(email: string, password: string) {
    try {
      const admin = await this.adminRepository
        .getModel()
        .findOne({
          email: email,
        })
        .exec();
      if (!admin) {
        return new NotFoundException('This email is not liked to any account');
      }
      const auth = await bcrypt.compare(password, admin.password);
      if (!auth) {
        return new UnauthorizedException('Invalid Credentials');
      }
      return [{ admin_id: admin._id, login: true }, admin];
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async loginSuperAdmin(email: string, password: string) {
    try {
      const authEmail = await bcrypt.compare(email, SUPER_ADMIN_EMAIL_HASH);
      if (!authEmail) {
        return new UnauthorizedException('Invalid credentials');
      }
      const authPassword = await bcrypt.compare(
        password,
        SUPER_ADMIN_PASSWORD_HASH,
      );
      if (!authPassword) {
        return new UnauthorizedException('Invalid credentials');
      }
      return true;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
