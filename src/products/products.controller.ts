import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('products') 
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' }) 
  @ApiBody({ type: CreateProductDto }) 
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with optional pagination' }) 
  @ApiQuery({
    name: 'skip',
    description: 'Number of items to skip',
    required: false,
    type: Number,
    example: 1,
  }) 
  @ApiQuery({
    name: 'limit',
    description: 'Number of items to return',
    required: false,
    type: Number,
    example: 10,
  }) 
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.productsService.findAll(paginationDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' }) 
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String }) 
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' }) 
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String }) 
  @ApiBody({ type: UpdateProductDto }) 
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' }) 
  @ApiParam({ name: 'id', description: 'The ID of the product', type: String }) 
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
