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
  UseInterceptors,
  UploadedFile,
  Query,
  HttpCode,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { ShopkeeperAuthenticationGuard } from '../auth/shopkeeper.auth.guard';
import { Permissions } from '../auth/permission.decorator';
import { ShopkeeperPermissionsGuard } from '../auth/permission.skp.guard';
import {
  PERMS_ADD_IMAGE,
  PERMS_ADD_PRODUCT_OPTION,
  PERMS_CREATE_PRODUCT,
  PERMS_DELETE_PRODUCT,
  PERMS_REMOVE_IMAGE,
  PERMS_REMOVE_PRODUCT_OPTION,
  PERMS_SET_FEATURED_IMAGE,
  PERMS_SET_FEATURED_VIDEO,
  PERMS_UPDATE_PRODUCT,
  PERMS_UPDATE_PRODUCT_OPTION,
} from '../auth/perms/shopkeeper';
import { ProductUpdatedType } from './entities/product.entity';
import { FindProductDto } from './dto/find-product.dto';
import { AddProductOptionDto } from './dto/add-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
import { DeleteProductOptionDto } from './dto/delete-product-option.dto';
import { CreateProductLikeDto } from './dto/create-product-like.dto';
import { CreateProductViewerDto } from './dto/create-product-viewer.dto';
import { UserDocument } from '../users/entities/user.entity';
import { UserAuthenticationGuard } from '../auth/user.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PRODUCT_CREATED } from '../events/app.events';
import { FilesUploadDto } from './dto/files-upload.dto';
import FileDeleteDto from './dto/delete-file.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_CREATE_PRODUCT)
  @UseGuards(ShopkeeperPermissionsGuard)
  @Post()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateProductDto,
    description: 'The category has been successfully created',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'data of the product that we want to create',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Session() session: Record<string, unknown>,
  ) {
    createProductDto.shopkeeper =
      session.shopkeeper['_id'] || session.shopkeeper['id'];
    createProductDto.store = session.store['_id'] || session.store['id'];
    const result = await this.productsService.create(createProductDto);
    if (result instanceof InternalServerErrorException) {
      return result;
    }
    this.eventEmitter.emit(PRODUCT_CREATED, result);
    return result;
  }

  @Get()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateProductDto,
    description: '',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreateProductDto,
    description: 'the request has succeeded',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiParam({
    name: 'id',
    description: 'the id of the product',
  })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

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
    type: CreateProductDto,
    isArray: true,
    description:
      'All resources has been fetched and is transmitted in the message body.',
  })
  @ApiBody({
    type: FindProductDto,
    description: 'data of the product that we want to create',
  })
  async find(@Body() filters: Record<string, unknown>) {
    return await this.productsService.find(filters);
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_UPDATE_PRODUCT)
  @UseGuards(ShopkeeperPermissionsGuard)
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
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiParam({
    name: 'id',
    description: 'the id of the product',
  })
  @Patch(':id')
  async update(
    @Param('id') productId: string,
    @Body() updateCategoryDto: UpdateProductDto,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.update(
      productId,
      updateCategoryDto,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_DELETE_PRODUCT)
  @UseGuards(ShopkeeperPermissionsGuard)
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
  @ApiOkResponse({
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiParam({
    name: 'id',
    description: 'the id of the product',
  })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.remove(id, session);
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_ADD_PRODUCT_OPTION)
  @UseGuards(ShopkeeperPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiBody({
    type: AddProductOptionDto,
    description: 'the option to add',
  })
  @Post('options')
  async addOption(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
    @Body('value') value: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.addOption(
      productId,
      optionId,
      value,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_UPDATE_PRODUCT_OPTION)
  @UseGuards(ShopkeeperPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiBody({
    type: UpdateProductOptionDto,
    description: 'the option to update',
  })
  @Patch('options')
  async updateOption(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
    @Body('value') value: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.updateOption(
      productId,
      optionId,
      value,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_REMOVE_PRODUCT_OPTION)
  @UseGuards(ShopkeeperPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiBody({
    type: DeleteProductOptionDto,
    description: 'the option we went to add',
  })
  @Delete('options')
  async removeOption(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.removeOption(
      productId,
      optionId,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_ADD_IMAGE)
  @UseGuards(ShopkeeperPermissionsGuard)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @UseInterceptors(
    FileInterceptor('images', {
      limits: {
        files: 1,
        fileSize: 2552000,
      },
      preservePath: true,
      dest: 'uploads/images/products',
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
    description: 'An image: the featured image of the product',
    type: FilesUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post('images')
  async addImagesUrls(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.addImagesUrls(
      productId,
      { ...file },
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_REMOVE_IMAGE)
  @UseGuards(ShopkeeperPermissionsGuard)
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
    description: 'An image: the featured image of the product',
    type: FileDeleteDto,
  })
  @Delete('images')
  async removeImagesUrls(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.removeImagesUrls(
      productId,
      { ...file },
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_SET_FEATURED_VIDEO)
  @UseGuards(ShopkeeperPermissionsGuard)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @UseInterceptors(
    FileInterceptor('video', {
      limits: {
        files: 1,
        fileSize: 22000,
      },
      preservePath: true,
      dest: '../uploads/videos/products',
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
    description: 'An image: the featured image of the product',
    type: FileUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post('video')
  async addOrReplaceVideo(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.setOrReplaceFeaturedVideo(
      productId,
      file.destination,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_SET_FEATURED_IMAGE)
  @UseGuards(ShopkeeperPermissionsGuard)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        files: 1,
        fileSize: 252000,
      },
      preservePath: true,
      dest: 'uploads/images/products',
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
    description: 'An image: the featured image of the product',
    type: FileUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post('featured-image')
  async addOrReplaceFeaturedImage(
    @Param('productId', MongooseObjectIdPipe) productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.productsService.setOrReplaceFeaturedImage(
      productId,
      { ...file },
      session,
    );
  }

  @ApiBody({
    type: CreateProductLikeDto,
    required: true,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiNotImplementedResponse({
    status: 501,
    description:
      ' the server does not support the functionality required to fulfill the request.',
    type: NotImplementedException,
  })
  @UseGuards(UserAuthenticationGuard)
  @Post('like')
  async likeProduct(
    @Body('userId', MongooseObjectIdPipe) userId: string,
    @Body('productId', MongooseObjectIdPipe) productId: string,
  ) {
    return await this.productsService.likeProduct(userId, productId);
  }

  @ApiBody({
    type: CreateProductLikeDto,
    required: true,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: ProductUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiNotImplementedResponse({
    status: 501,
    description:
      ' the server does not support the functionality required to fulfill the request.',
    type: NotImplementedException,
  })
  @UseGuards(UserAuthenticationGuard)
  @Delete('like')
  async disLikeProduct(
    @Body('userId', MongooseObjectIdPipe) userId: string,
    @Body('productId', MongooseObjectIdPipe) productId: string,
  ) {
    return await this.productsService.disLikeProduct(userId, productId);
  }

  @ApiBody({
    type: CreateProductViewerDto,
    required: true,
  })
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  async ViewProduct(
    @Body('userId', MongooseObjectIdPipe) userId: string,
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Session() user: UserDocument,
  ) {
    if (!user._id) {
      return new UnauthorizedException('the user must be authenticated');
    }
    return this.productsService.incrementProductViews(userId, productId);
  }

  @ApiQuery({
    name: 'q',
    description: 'the search phrase',
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: '',
    isArray: true,
    status: 200,
    description: 'the request has succeeded.',
  })
  @HttpCode(200)
  @Post('search')
  async search(@Query('q') q: string) {
    return await this.productsService.search(q);
  }
}
