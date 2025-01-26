import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/products.schema';
import { PaginationDTO } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from './ultils/constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(paginationDTO: PaginationDTO): Promise<any> {
    const { skip = 0, limit = DEFAULT_PAGE_SIZE } = paginationDTO;
    const total = await this.productModel.countDocuments();
    const data = await this.productModel.find().skip(skip).limit(limit).exec();
    return {
      data,
      total,
    };
  }

  async findOne(id: string): Promise<Product | null> {
    const result = await this.productModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    const result = this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    return result;
  }

  async remove(id: string) {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product Id: ' + id + ' not found');
    }
    return { message: 'Delete Successful' };
  }
}
