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
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { AdminAuthenticationGuard } from '../auth/admin.auth.guard';
import {
  PERMS_CREATE_FAMILY,
  PERMS_DELETE_FAMILY,
  PERMS_FIND_FAMILY_ALL,
  PERMS_GET_FAMILY,
  PERMS_UPDATE_FAMILY,
} from '../auth/perms/admin';
import { AdminPermissionsGuard } from '../auth/permission.admin.guard';
import { Permissions } from '../auth/permission.decorator';

@ApiTags('Families')
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_CREATE_FAMILY)
  @UseGuards(AdminPermissionsGuard)
  @Post()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateFamilyDto,
    description: 'The category has been successfully created',
  })
  async create(@Body() createFamilyDto: CreateFamilyDto) {
    return await this.familiesService.create(createFamilyDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_GET_FAMILY)
  @UseGuards(AdminPermissionsGuard)
  @Get()
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiCreatedResponse({
    type: CreateFamilyDto,
    description: '',
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "the server can't find the requested resource.",
    type: ApiNotFoundResponse,
    status: 404,
  })
  async findAll() {
    return await this.familiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.familiesService.findOne(id);
  }

  @Post('find')
  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_FIND_FAMILY_ALL)
  @UseGuards(AdminPermissionsGuard)
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
    type: CreateFamilyDto,
    isArray: true,
    description:
      'All resources has been fetched and is transmitted in the message body.',
  })
  async find(@Body() filters: Record<string, unknown>) {
    return await this.familiesService.find(filters);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_UPDATE_FAMILY)
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
    @Body() updateCategoryDto: UpdateFamilyDto,
  ) {
    return await this.familiesService.update(id, updateCategoryDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_DELETE_FAMILY)
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
    return await this.familiesService.remove(id);
  }
}
