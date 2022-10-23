import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Inject,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Injectable,
  InternalServerErrorException,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AuthService {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
    @Inject(AdminRepository) private adminRepository: AdminRepository,
  ) {}

  async loginUser(phonenumber: string, password: string) {
    try {
      const user = await this.usersRepository
        .getModel()
        .findOne({
          phonenumber: phonenumber,
        })
        .lean();
      if (!user) {
        return {
          message: 'This phone number is not liked to any account',
          status: 400,
          data: {
            keys: ['phonenumber'],
          },
        };
      }
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
        return {
          message: 'Invalid credentials',
          status: 400,
          data: {
            keys: ['phonenumber', 'password'],
          },
        };
      }
      return {
        message: 'User login successfully',
        status: 200,
        data: user,
      };
    } catch (e) {
      return {
        message: e.message,
        status: 400,
        data: { ...e },
      };
    }
  }

  async loginAdmin(phonenumber: string, password: string) {
    try {
      const admin = await this.adminRepository
        .getModel()
        .findOne({
          phonenumber: phonenumber,
        })
        .exec();
      if (!admin) {
        return {
          message: 'this email is not linked to any account',
          status: 400,
          data: {},
        };
      }
      const auth = await bcrypt.compare(password, admin.password);
      if (!auth) {
        return {
          message: 'invalid credentials',
          status: 400,
          data: {},
        };
      }
      return {
        message: 'ok',
        status: 200,
        data: {},
      };
    } catch (e) {
      return {
        message: e.message,
        status: 500,
        data: {},
      };
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
