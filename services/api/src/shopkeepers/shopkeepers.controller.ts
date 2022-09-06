import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpCode,
  UseGuards,
  Session,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { ShopkeeperPermissionPipe } from '../utils/pipes/shopkeeperPermission.pipe';
import { ShopkeepersService } from './shopkeepers.service';
import { CreateShopkeeperDto } from './dto/create-shopkeeper.dto';
import { PERMS_CREATE_SHOPKEEPER } from '../auth/perms/user';
import { PermissionsGuard } from '../auth/permission.guard';
import { UserAuthenticationGuard } from '../auth/user.auth.guard';
import { Permissions } from '../auth/permission.decorator';
import { ShopkeeperAuthenticationGuard } from '../auth/shopkeeper.auth.guard';
import {
  PERMS_DELETE_SHOPKEEPER,
  PERMS_FIND_ALL_SHOPKEEPER,
} from '../auth/perms/shopkeeper';
import { ShopkeeperPermissionsGuard } from '../auth/permission.skp.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminPermissionsGuard } from '../auth/permission.admin.guard';
import { AdminAuthenticationGuard } from '../auth/admin.auth.guard';
import {
  PERMS_ADD_SHOPKEEPER_PERMISSION,
  PERMS_REMOVE_SHOPKEEPER_PERMISSION,
} from '../auth/perms/admin';
import { PermissionsService } from '../services/permissions/permissions';
import { SHOPKEEPER_PERMISSION_CHANGE } from '../events/app.events';
import { InjectModel } from '@nestjs/mongoose';
import { RemoveShopkeeperPerms } from './dto/remove-shopkeeper-perms.dto';
import { AddShopkeeperPerms } from './dto/add-shopkeeper-perms.dto';
import { Model } from 'mongoose';

@ApiTags('Shopkeepers')
@Controller('shopkeepers')
export class ShopkeepersController {
  constructor(
    private readonly shopkeepersService: ShopkeepersService,
    private eventEmitter: EventEmitter2,
    @InjectModel('shopkeepers') private shopkeeperModel: Model<string>,
  ) {}

  @UseGuards(UserAuthenticationGuard)
  @Permissions(PERMS_CREATE_SHOPKEEPER)
  @UseGuards(PermissionsGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'A record has successfully created',
    type: CreateShopkeeperDto,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiBody({
    required: true,
    description: '',
    type: CreateShopkeeperDto,
  })
  create(@Body() createShopkeeperDto: CreateShopkeeperDto) {
    return this.shopkeepersService.create(createShopkeeperDto);
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_FIND_ALL_SHOPKEEPER)
  @UseGuards(ShopkeeperPermissionsGuard)
  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    description:
      'All resources has been fetched and is transmitted in the message body.',
    type: '',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: NotFoundException,
    status: 404,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  findAll() {
    return this.shopkeepersService.findAll();
  }

  @ApiOkResponse({
    status: 200,
    description:
      'The resource has been fetched and is transmitted in the message body.',
    type: CreateShopkeeperDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "the server can't find the requested resource.",
    type: NotFoundException,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopkeepersService.findOne(id);
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_DELETE_SHOPKEEPER)
  @UseGuards(ShopkeeperPermissionsGuard)
  @Delete(':id')
  @ApiOkResponse({
    status: 200,
    description: 'The resource has been deleted.',
    type: '',
  })
  @ApiBadRequestResponse({
    description:
      'the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
    type: BadRequestException,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  remove(@Param('id') id: string) {
    return this.shopkeepersService.remove(id);
  }

  @Post('/:shopkeeperId/add-perms')
  @ApiBody({
    description: 'the permission (in camel case)',
    required: true,
    type: AddShopkeeperPerms,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_ADD_SHOPKEEPER_PERMISSION)
  @UseGuards(AdminPermissionsGuard)
  async addUserPermission(
    @Param('userId', MongooseObjectIdPipe) userId: string,
    @Body('perms', ShopkeeperPermissionPipe) perms: string,
    @Session() session: Record<string, unknown>,
  ) {
    /** L'injection de dependances (du module user) dans le module admin ne fonctionne pas
        raison pour laquelle je doit utiliser ici le service d'administration
    */
    const result = await new PermissionsService().addShopkeeperPerms(
      perms,
      userId,
      this.shopkeeperModel,
    );
    this.eventEmitter.emit(
      SHOPKEEPER_PERMISSION_CHANGE,
      session,
      result['permissions'],
    );
    return result;
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_REMOVE_SHOPKEEPER_PERMISSION)
  @UseGuards(PermissionsGuard)
  @Post('/:shopkeeperId/remove-perms')
  @ApiBody({
    description: 'the permission (in camel case)',
    required: true,
    type: RemoveShopkeeperPerms,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  async removeUserPermission(
    @Param('userId', MongooseObjectIdPipe) userId: string,
    @Body('perms', ShopkeeperPermissionPipe) perms: string,
    @Session() session: Record<string, unknown>,
  ) {
    /** L'injection de dependances (du module user) dans le module admin ne fonctionne pas
        raison pour laquelle je doit utiliser ici le service d'administration 
    */
    const result = await new PermissionsService().removeShopkeeperPerms(
      perms,
      userId,
      this.shopkeeperModel,
    );
    this.eventEmitter.emit(
      SHOPKEEPER_PERMISSION_CHANGE,
      session,
      result['permissions'],
    );
    return result;
  }
}
