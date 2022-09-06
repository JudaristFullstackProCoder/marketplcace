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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthenticationGuard } from '../auth/admin.auth.guard';
import { AdminPermissionsGuard } from '../auth/permission.admin.guard';
import { Permissions } from '../auth/permission.decorator';
import {
  PERMS_CREATE_CATEGORY,
  PERMS_DELETE_CATEGORY,
  PERMS_UPDATE_CATEGORY,
} from '../auth/perms/admin';
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_CREATE_CATEGORY)
  @UseGuards(AdminPermissionsGuard)
  @Post()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: 'The category has been successfully created',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: '',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(id);
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
    type: CreateCategoryDto,
    isArray: true,
    description:
      'All resources has been fetched and is transmitted in the message body.',
  })
  async find(@Body() filters: Record<string, unknown>) {
    return await this.categoriesService.find(filters);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_UPDATE_CATEGORY)
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_DELETE_CATEGORY)
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
    return await this.categoriesService.remove(id);
  }

  @Post('options')
  async addOption(
    @Body('categoryId', MongooseObjectIdPipe) categoryId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
  ) {
    return await this.categoriesService.addOption(categoryId, optionId);
  }

  @Delete('options')
  async removeOption(
    @Body('categoryId', MongooseObjectIdPipe) categoryId: string,
    @Body('optionId', MongooseObjectIdPipe) optionId: string,
  ) {
    return await this.categoriesService.removeOption(categoryId, optionId);
  }
}
