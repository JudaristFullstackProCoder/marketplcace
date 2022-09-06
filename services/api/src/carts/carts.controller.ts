import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../auth/permission.decorator';
import { PermissionsGuard } from '../auth/permission.guard';
import {
  PERMS_ADD_PRODUCT_TO_CART,
  PERMS_REMOVE_PRODUCT_TO_CART,
} from '../auth/perms/user';
import { UserAuthenticationGuard } from '../auth/user.auth.guard';
import { MongooseObjectIdPipe } from '../utils/pipes/mongooseObjectId.pipe';
import { CartsService } from './carts.service';
import { AddCartProductDto } from './dto/add-cart-product.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { FindCartDto } from './dto/find-cart.dto';
import { RemoveCartProductDto } from './dto/remove-cart-product.dto';
import { CartUpdated } from './entities/cart.entity';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiCreatedResponse({
    description: 'A record has successfully created',
    type: CreateCartDto,
  })
  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiBody({
    required: true,
    description: '',
    type: CreateCartDto,
  })
  @Post()
  create(@Body() createOptionDto: CreateCartDto) {
    return this.cartsService.create(createOptionDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    description:
      'All resources has been fetched and is transmitted in the message body.',
    type: CreateCartDto,
    isArray: true,
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
    return this.cartsService.findAll();
  }

  @ApiOkResponse({
    status: 200,
    description:
      'The resource has been fetched and is transmitted in the message body.',
    type: CreateCartDto,
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
  @ApiParam({
    name: 'id',
    description: 'the id of the cart',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(id);
  }

  @ApiBody({
    type: FindCartDto,
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
    return this.cartsService.find(filters);
  }

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
  @ApiParam({
    name: 'id',
    description: 'the id of the cart',
  })
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }

  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: CartUpdated,
    description: 'the product was successfully added to the cart',
  })
  @ApiBody({
    type: AddCartProductDto,
  })
  @UseGuards(UserAuthenticationGuard)
  @Permissions(PERMS_ADD_PRODUCT_TO_CART)
  @UseGuards(PermissionsGuard)
  @Post('product')
  async addProduct(
    @Body('CartId', MongooseObjectIdPipe) categoryId: string,
    @Body('productId', MongooseObjectIdPipe) optionId: string,
  ) {
    return await this.cartsService.addProduct(categoryId, optionId);
  }

  @ApiInternalServerErrorResponse({
    description:
      'the server encountered an unexpected condition that prevented it from fulfilling the request.',
    type: InternalServerErrorException,
  })
  @ApiOkResponse({
    type: CartUpdated,
    description: 'the product was successfully removed from the cart',
  })
  @ApiBody({
    type: RemoveCartProductDto,
  })
  @UseGuards(UserAuthenticationGuard)
  @Permissions(PERMS_REMOVE_PRODUCT_TO_CART)
  @UseGuards(PermissionsGuard)
  @Delete('product')
  async removeOption(
    @Body('CartId', MongooseObjectIdPipe) categoryId: string,
    @Body('productId', MongooseObjectIdPipe) optionId: string,
  ) {
    return await this.cartsService.removeProduct(categoryId, optionId);
  }
}
