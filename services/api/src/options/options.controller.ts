import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../auth/permission.decorator';
import {
  PERMS_CREATE_OPTION,
  PERMS_DELETE_OPTION,
  PERMS_FIND_OPTION,
  PERMS_FIND_OPTION_ALL,
  PERMS_UPDATE_OPTION,
} from '../auth/perms/admin';
import { AdminPermissionsGuard } from '../auth/permission.admin.guard';
import { AdminAuthenticationGuard } from '../auth/admin.auth.guard';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_CREATE_OPTION)
  @UseGuards(AdminPermissionsGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'A record has successfully created',
    type: CreateOptionDto,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiBody({
    required: true,
    description: '',
    type: CreateOptionDto,
  })
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_FIND_OPTION_ALL)
  @UseGuards(AdminPermissionsGuard)
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
    return this.optionsService.findAll();
  }

  @ApiOkResponse({
    status: 200,
    description:
      'The resource has been fetched and is transmitted in the message body.',
    type: CreateOptionDto,
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
    return this.optionsService.findOne(id);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_UPDATE_OPTION)
  @UseGuards(AdminPermissionsGuard)
  @ApiOkResponse({
    status: 200,
    description:
      'The resource has been fetched and is transmitted in the message body.',
    type: '',
  })
  @ApiBadRequestResponse({
    description: 'error when trying to update the option',
    type: BadRequestException,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(id, updateOptionDto);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_FIND_OPTION)
  @UseGuards(AdminPermissionsGuard)
  @ApiBody({
    type: CreateOptionDto,
    required: true,
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
  @ApiOkResponse({
    status: 200,
    description:
      'The resource has been fetched and is transmitted in the message body.',
    isArray: false,
  })
  @Get('find')
  find(@Body() filters: Record<string, any>) {
    return this.optionsService.find(filters);
  }

  @UseGuards(AdminAuthenticationGuard)
  @Permissions(PERMS_DELETE_OPTION)
  @UseGuards(AdminPermissionsGuard)
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
    return this.optionsService.remove(id);
  }
}
