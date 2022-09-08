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
  Session,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
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
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { VariationsService } from './variations.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { ShopkeeperAuthenticationGuard } from '../auth/shopkeeper.auth.guard';
import { Permissions } from '../auth/permission.decorator';
import { VariationUpdatedType } from './entities/variation.entity';
import {
  PERMS_ADD_VARIATION_OPTION,
  PERMS_REMOVE_VARIATION_OPTION,
  PERMS_SET_FEATURED_IMAGE,
  PERMS_UPDATE_VARIATION_OPTION,
} from '../auth/perms/shopkeeper';
import { ShopkeeperPermissionsGuard } from '../auth/permission.skp.guard';
import { FindVariationDto } from './dto/find-variation.dto';
import { AddVariationOptionDto } from './dto/add-variation-option.dto';
import { DeleteVariationOptionDto } from './dto/delete-variation-option.dto';
import { FileUploadDto } from 'src/products/dto/file-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Variations')
@Controller('variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsService) {}

  @Post()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateVariationDto,
    description: 'The category has been successfully created',
  })
  @ApiBody({
    type: CreateVariationDto,
    description: 'resource data',
    required: true,
  })
  async create(@Body() createVariationDto: CreateVariationDto) {
    return await this.variationsService.create(createVariationDto);
  }

  @Get()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateVariationDto,
    description: '',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  async findAll() {
    return await this.variationsService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'the id of the variation',
    required: true,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiOkResponse({
    type: CreateVariationDto,
    status: 200,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  async findOne(@Param('id') id: string) {
    return await this.variationsService.findOne(id);
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
    type: CreateVariationDto,
    isArray: true,
    description:
      'All resources has been fetched and is transmitted in the message body.',
  })
  @ApiBody({
    type: FindVariationDto,
    description: 'find variation with filters',
  })
  async find(@Body() filters: Record<string, unknown>) {
    return await this.variationsService.find(filters);
  }

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
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiOkResponse({
    type: VariationUpdatedType,
    description:
      'The resources has been updated and is transmitted in the message body.',
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  @ApiBody({
    type: UpdateVariationDto,
    description: 'find variation with filters',
  })
  async update(
    @Param('id') id: string,
    @Body() updateVariationDto: UpdateVariationDto,
    session: Record<string, unknown>,
  ) {
    return await this.variationsService.update(id, updateVariationDto, session);
  }

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
  @ApiUnauthorizedResponse({
    description:
      ' the client request has not been completed because it lacks valid authentication credentials for the requested resource. ',
    status: 401,
    type: UnauthorizedException,
  })
  @ApiOkResponse({
    type: VariationUpdatedType,
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
    description: 'the id of the variation',
  })
  async remove(
    @Param('id') id: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.variationsService.remove(id, session);
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_ADD_VARIATION_OPTION)
  @UseGuards(ShopkeeperPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: VariationUpdatedType,
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
    type: AddVariationOptionDto,
    description: 'find variation with filters',
  })
  @Post('options')
  async addOption(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
    @Body('value', MongooseObjectIdPipe) value: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.variationsService.addOption(
      productId,
      optionId,
      value,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_UPDATE_VARIATION_OPTION)
  @UseGuards(ShopkeeperPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: VariationUpdatedType,
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
    type: UpdateVariationDto,
    description: 'find variation with filters',
  })
  @Patch('options')
  async updateOption(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
    @Body('value', MongooseObjectIdPipe) value: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.variationsService.updateOption(
      productId,
      optionId,
      value,
      session,
    );
  }

  @UseGuards(ShopkeeperAuthenticationGuard)
  @Permissions(PERMS_REMOVE_VARIATION_OPTION)
  @UseGuards(ShopkeeperPermissionsGuard)
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: VariationUpdatedType,
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
    type: DeleteVariationOptionDto,
    description: 'find variation with filters',
  })
  @Delete('options')
  async removeOption(
    @Body('productId', MongooseObjectIdPipe) productId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.variationsService.removeOption(
      productId,
      optionId,
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
      dest: '../uploads/images/products',
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
  @Post('image')
  async addOrReplaceFeaturedImage(
    @Param('productId', MongooseObjectIdPipe) productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, unknown>,
  ) {
    return await this.variationsService.addOrReaplaceImage(
      productId,
      { ...file },
      session,
    );
  }
}
