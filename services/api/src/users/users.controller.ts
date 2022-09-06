import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Session,
  UseGuards,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as events from '../events/app.events';
import { PermissionsService } from '../services/permissions/permissions';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as e from '../auth/perms/user';
import * as ee from '../auth/perms/admin';
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { UserPermissionPipe } from '../utils/pipes/userPermission.pipe';
import { DeleteUserPermsDto } from './dto/delete-user-perms.dto';
import { AddUserPermsDto } from './dto/add-user-perms.dto';
import { Permissions } from '../auth/permission.decorator';
import { PermissionsGuard } from '../auth/permission.guard';
import { AdminAuthenticationGuard } from '../auth/admin.auth.guard';
import { AddUserSubscriptionDto } from './dto/add-user-subscription.dto';
import { RemoveUserSubscriptionDto } from './dto/remove-user-subscription.dto';
import { UserAuthenticationGuard } from '../auth/user.auth.guard';

@Controller('users')
@ApiTags('User')
export default class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private eventEmitter: EventEmitter2,
    @InjectModel('users') private readonly usersModel: Model<string>,
  ) {}

  @Post()
  @ApiBody({
    required: true,
    type: CreateUserDto,
    description: 'user data',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserDto,
    status: 201,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Session() session,
  ): Promise<User | InternalServerErrorException> {
    if (session.user) {
      // the user is already login
      return new UnauthorizedException('User already exist');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create(createUserDto);
    if (user instanceof InternalServerErrorException) {
      return user;
    }
    this.eventEmitter.emit(events.USER_CREATED, session, 'user', user);
    return user;
  }

  @Get()
  @ApiOkResponse({
    description: 'The record has been successfully fetched.',
    isArray: true,
    status: 200,
    type: CreateUserDto,
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
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('/all-available-perms')
  @ApiOkResponse({
    description: 'A list of permissions that every user can have',
    status: 200,
  })
  getAllAvailablesUserPerms() {
    return e.USER_DEFAULTS_PERMISSIONS;
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: CreateUserDto,
    status: 200,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "the server can't find the requested resource.",
    type: NotFoundException,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: 'The record has been successfully updated.',
    status: 200,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Session() session: Record<string, unknown>,
  ) {
    return this.usersService.update(id, updateUserDto, session);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
    type: 'The record has been successfully deleted.',
    status: 200,
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
  remove(
    @Param('userId') userId: string,
    @Session() session: Record<string, unknown>,
  ) {
    const result = this.usersService.remove(userId, session);
    this.eventEmitter.emit(events.USER_DELETED, userId);
    this.eventEmitter.emit(events.USER_LOGOUT, session);
    return result;
  }

  @Post('/:userId/add-perms')
  @ApiBody({
    description: 'the permission (in camel case)',
    required: true,
    type: AddUserPermsDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @UseGuards(AdminAuthenticationGuard)
  @Permissions(ee.PERMS_ADD_USER_PERMISSION)
  @UseGuards(PermissionsGuard)
  async addUserPermission(
    @Param('userId', MongooseObjectIdPipe) userId: string,
    @Body('perms', UserPermissionPipe) perms: string,
    @Session() session: Record<string, unknown>,
  ) {
    /** L'injection de dependances (du module user) dans le module admin ne fonctionne pas
        raison pour laquelle je doit utiliser ici le service d'administration
    */
    const result = await new PermissionsService().addUserPerms(
      perms,
      userId,
      this.usersModel,
    );
    this.eventEmitter.emit(
      events.USER_PERMISSION_CHANGE,
      session,
      result['permissions'],
    );
    return result;
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(ee.PERMS_REMOVE_USER_PERMISSION)
  @UseGuards(PermissionsGuard)
  @Post('/:userId/remove-perms')
  @ApiBody({
    description: 'the permission (in camel case)',
    required: true,
    type: DeleteUserPermsDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  async removeUserPermission(
    @Param('userId', MongooseObjectIdPipe) userId: string,
    @Body('perms', UserPermissionPipe) perms: string,
    @Session() session: Record<string, unknown>,
  ) {
    /** L'injection de dependances (du module user) dans le module admin ne fonctionne pas
        raison pour laquelle je doit utiliser ici le service d'administration 
    */
    const result = await new PermissionsService().removeUserPerms(
      perms,
      userId,
      this.usersModel,
    );
    this.eventEmitter.emit(
      events.USER_PERMISSION_CHANGE,
      session,
      result['permissions'],
    );
    return result;
  }

  @UseGuards(UserAuthenticationGuard)
  @Permissions(e.PERMS_USER_SUBSCRIBE)
  @UseGuards(PermissionsGuard)
  @ApiBody({
    type: AddUserSubscriptionDto,
    description: 'userId (subscriber) subscribe to storeId (store)',
    required: true,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: null,
    description: 'user successfully subscribe to store',
    status: 200,
  })
  @HttpCode(200)
  @Post('subscribe')
  async addSubscription(
    @Body('userId') userId: string,
    @Body('storeId') storeId: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.usersService.addSubscription(userId, storeId, session);
  }

  @UseGuards(UserAuthenticationGuard)
  @Permissions(e.PERMS_USER_UNSUBSCRIBE)
  @UseGuards(PermissionsGuard)
  @ApiBody({
    type: RemoveUserSubscriptionDto,
    description: 'userId (subscriber) unsubscribe to storeId (store)',
    required: true,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: null,
    description: 'user successfully unsubscribe to store',
    status: 200,
  })
  @HttpCode(200)
  @Delete('unsubscribe')
  async removeSubscription(
    @Body('userId') userId: string,
    @Body('storeId') storeId: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.usersService.removeSubscription(userId, storeId, session);
  }
}
