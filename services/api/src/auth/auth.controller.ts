import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Redirect,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ADMIN_LOGIN,
  ADMIN_LOGOUT,
  SUPER_ADMIN_LOGIN,
  SUPER_ADMIN_LOGOUT,
  USER_LOGIN,
  USER_LOGOUT,
} from '../events/app.events';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private eventEmitter: EventEmitter2,
    private authService: AuthService,
  ) {}

  @ApiBody({
    type: LoginDto,
    description: 'credentials: email and password',
    required: true,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "the server can't find the requested resource.",
    type: NotFoundException,
  })
  @ApiOkResponse({
    type: CreateUserDto,
    description: '',
    status: 200,
  })
  @Post('/user/login/')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: Record<string, any>,
  ) {
    const login = await this.authService.loginUser(email, password);
    if (
      !(login instanceof InternalServerErrorException) &&
      !(login instanceof NotFoundException) &&
      !(login instanceof UnauthorizedException)
    ) {
      this.eventEmitter.emit(USER_LOGIN, session, login);
    }
    return login;
  }

  @HttpCode(200)
  @Post('/user/logout/')
  @Redirect('/')
  logoutUser(@Session() session: Record<string, unknown>) {
    this.eventEmitter.emit(USER_LOGOUT, session);
  }

  @ApiBody({
    type: LoginDto,
    description: 'credentials: email and password',
    required: true,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "the server can't find the requested resource.",
    type: NotFoundException,
  })
  @HttpCode(200)
  @Post('/admin/login/')
  async loginAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: Record<string, any>,
  ) {
    const login = await this.authService.loginAdmin(email, password);
    if (
      !(login instanceof InternalServerErrorException) &&
      !(login instanceof NotFoundException) &&
      !(login instanceof UnauthorizedException)
    ) {
      this.eventEmitter.emit(ADMIN_LOGIN, session, login[1]);
    }
    if (
      login instanceof InternalServerErrorException ||
      login instanceof NotFoundException ||
      login instanceof UnauthorizedException
    ) {
      this.eventEmitter.emit(ADMIN_LOGIN, session, login[1]);
    }
    return login[0];
  }

  @HttpCode(200)
  @Post('/admin/logout/')
  @Redirect('/')
  logoutAdmin(@Session() session: Record<string, unknown>) {
    this.eventEmitter.emit(ADMIN_LOGOUT, session);
  }

  @ApiBody({
    type: LoginDto,
    description: 'credentials: email and password',
    required: true,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "the server can't find the requested resource.",
    type: NotFoundException,
  })
  @HttpCode(200)
  @Post('/super-admin/login/')
  async loginSuperAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: Record<string, any>,
  ) {
    const login = await this.authService.loginSuperAdmin(email, password);
    if (
      !(login instanceof InternalServerErrorException) &&
      !(login instanceof UnauthorizedException)
    ) {
      this.eventEmitter.emit(SUPER_ADMIN_LOGIN, session);
    }
    if (
      login instanceof InternalServerErrorException ||
      login instanceof UnauthorizedException
    ) {
      return login;
    }
    return { super_admin_id: 'super__id__admin', login: true };
  }

  @HttpCode(200)
  @Post('/super-admin/logout/')
  logoutSuperAdmin(@Session() session: Record<string, unknown>) {
    this.eventEmitter.emit(SUPER_ADMIN_LOGOUT, session);
  }
}
