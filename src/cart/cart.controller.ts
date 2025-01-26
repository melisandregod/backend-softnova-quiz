import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiBody({ type: CreateCartDto })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart', type: String })
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart', type: String })
  @ApiBody({ type: UpdateCartDto })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cart', type: String })
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Get(':id/calculate')
  @ApiOperation({
    summary: 'Calculate the total, discount, and net price of a cart',
  })
  @ApiParam({ name: 'id', description: 'The ID of the cart', type: String })
  async calculate(@Param('id') cartId: string) {
    return this.cartService.calculate(cartId);
  }
}
