import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotImplementedException,
  BadRequestException,
  UseGuards,
  Session,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  Res,
  Req,
  Inject,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminAuthenticationGuard } from '../auth/admin.auth.guard';
import { AdminPermissionsGuard } from '../auth/permission.admin.guard';
import { Permissions } from '../auth/permission.decorator';
import {
  PERMS_ADD_STORE_WYS,
  PERMS_CREATE_STORE,
  PERMS_DELETE_STORE,
  PERMS_FIND_STORE,
  PERMS_FIND_STORE_ALL,
  PERMS_GET_STORE,
  PERMS_REMOVE_STORE_WYS,
  PERMS_UPDATE_STORE,
} from '../auth/perms/admin';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { Store } from './entities/store.entity';
import { UserAuthenticationGuard } from '../auth/user.auth.guard';
import { PermissionsGuard } from '../auth/permission.guard';
import { PERMS_OPEN_STORE } from '../auth/perms/user';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STORE_OPENED } from '../events/app.events';
import { ShopkeeperRepository } from '../shopkeepers/shopkeeper.repository';
import { FileUploadDto } from '../products/dto/file-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PERMS_ADD_STORE_IMAGE } from '../auth/perms/shopkeeper';
import { ShopkeeperAuthenticationGuard } from '../auth/shopkeeper.auth.guard';
import { ShopkeeperPermissionsGuard } from '../auth/permission.skp.guard';
import { Request, Response } from 'express';
import { REQUEST } from '@nestjs/core';
@ApiTags('Store')
@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private eventEmitter: EventEmitter2,
    private shopkeeperRepository: ShopkeeperRepository,
  ) {}

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_CREATE_STORE)
  @UseGuards(AdminPermissionsGuard)
  @Post()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateStoreDto,
    description: 'The category has been successfully created',
  })
  async create(@Body() createStoreDto: CreateStoreDto) {
    return await this.storesService.create(createStoreDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_FIND_STORE_ALL)
  @UseGuards(AdminPermissionsGuard)
  @Get()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateStoreDto,
    description: '',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  async findAll() {
    return await this.storesService.findAll();
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_GET_STORE)
  @UseGuards(AdminPermissionsGuard)
  @ApiOkResponse({
    status: 200,
    type: Store,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storesService.findOne(id);
  }

  @UseGuards(UserAuthenticationGuard)
  // @Permissions(PERMS_OPEN_STORE)
  // @UseGuards(PermissionsGuard)
  @ApiOkResponse({
    status: 200,
    type: Store,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @Post('open')
  /**
   * Load store information in the session…
   */
  async OpenStore(@Session() session: Record<string, any>, @Req() request: Request) {
    console.log(session.user._id.toString());
    const store = this.storesService.find({
      shopkeeper: session.user._id.toString(),
    });
    console.log(store);
    if (
      store.status === 200
    ) {
      const shopkeeper = await this.shopkeeperRepository
        .getModel()
        .findOne({ user: session.user._id.toString() })
        .exec();
      session["store"] = store.data;
      session["shopkeeper"] = shopkeeper;
      return {
        message: "user store opened successfully…",
        status: 200,
        data: {
          shopkeeeperId: shopkeeper.id,
          userId: session?.user?._id,
          storeId: store?.data?._id,
        }
      }
    } else {
      return {
        message: "can't open store…",
        status: 500,
        data: {},
      }
    }
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_FIND_STORE)
  @UseGuards(AdminPermissionsGuard)
  @Post('find')
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiOkResponse({
    type: CreateStoreDto,
    isArray: true,
    description:
      'All resources has been fetched and is transmitted in the message body.',
  })
  async find(@Body() filters: Record<string, unknown>) {
    return await this.storesService.find(filters);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_UPDATE_STORE)
  @UseGuards(AdminPermissionsGuard)
  @Patch(':id')
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiNotImplementedResponse({
    type: NotImplementedException,
    description:
      'the server does not support the functionality required to fulfill the request.',
  })
  @ApiOkResponse({
    type: null,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateStoreDto,
  ) {
    return await this.storesService.update(id, updateCategoryDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_DELETE_STORE)
  @UseGuards(AdminPermissionsGuard)
  @Delete(':id')
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiBadRequestResponse({
    description:
      ' the server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
    type: BadRequestException,
  })
  async remove(@Param('id') id: string) {
    return await this.storesService.remove(id);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_ADD_STORE_WYS)
  @UseGuards(AdminPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiParam({
    name: 'storeId',
    description: 'wys (product family id you add)',
  })
  @ApiParam({
    name: 'wysId',
    description: 'wys (product family id you remove)',
  })
  @Post('remove/wys')
  async addWys(
    @Param('storeId', MongooseObjectIdPipe) storeId: string,
    @Param('wysId', MongooseObjectIdPipe) wysId: never,
  ) {
    return await this.storesService.addWys(storeId, wysId);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_REMOVE_STORE_WYS)
  @UseGuards(AdminPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiParam({
    name: 'storeId',
    description: 'wys (product family id you add)',
  })
  @ApiParam({
    name: 'wysId',
    description: 'wys (product family id you remove)',
  })
  @Post('add/wys')
  async removeWys(
    @Param('storeId', MongooseObjectIdPipe) storeId: string,
    @Param('wysId', MongooseObjectIdPipe) wysId: never,
  ) {
    return await this.storesService.removeWys(storeId, wysId);
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_ADD_STORE_IMAGE)
  @UseGuards(ShopkeeperPermissionsGuard)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        files: 1,
        fileSize: 22000,
      },
      preservePath: true,
      dest: '../uploads/images/stores',
    }),
  )
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiParam({
    name: 'productId',
    required: true,
  })
  @ApiBody({
    description: 'An image: the cover image of the store',
    type: FileUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post('image')
  async addStoreImage(
    @Body('storeId', MongooseObjectIdPipe) storeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.storesService.setOrReplaceFeaturedImage(
      storeId,
      { ...file },
      session,
    );
  }
}
