/* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const createdCart = new this.cartModel(createCartDto);
    return createdCart.save();
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().populate('products.productId').exec();
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel
      .findById(id)
      .populate('products.productId')
      .exec();
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart | null> {
    const result = this.cartModel
      .findByIdAndUpdate(id, updateCartDto, { new: true })
      .exec();
    return result;
  }

  async remove(id: string) {
    const result = await this.cartModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Cart Id: ' + id + ' not found');
    }
    return { message: 'Delete Successful' };
  }

  async calculate(cartId: string): Promise<{
    total: number;
    totalPrice: number;
    discount: number;
    net: number;
  }> {
    const cart = await this.cartModel
      .findById(cartId)
      .populate('products.productId')
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    let totalPrice = 0;
    let discount = 0;

    const total = cart.products.reduce((sum, item) => sum + item.quantity, 0);

    
    const bookCount = cart.products.reduce((countMap, item) => {
      const product = item.productId as any;
      const productId = product._id.toString();
      countMap[productId] = (countMap[productId] || 0) + item.quantity;

      return countMap;
    }, {});

    
    while (Object.keys(bookCount).length > 0) {
      const uniqueBooks = Object.keys(bookCount).length; 
      const applicableBooks = Math.min(uniqueBooks, 7); 

      
      const discountBooks = Object.keys(bookCount).slice(0, applicableBooks);
      const groupPrice = discountBooks.reduce((sum, bookId) => {
        const product = cart.products.find(
          (item) => item.productId._id.toString() === bookId,
        )?.productId as any;
        return sum + (product?.price || 0);
      }, 0);

      
      const discountRate = [0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6][
        applicableBooks
      ];
      discount += groupPrice * discountRate;

     
      for (const bookId of discountBooks) {
        bookCount[bookId] -= 1;
        if (bookCount[bookId] === 0) {
          delete bookCount[bookId]; 
        }
      }
    }

    
    totalPrice = cart.products.reduce((sum, item) => {
      const product = item.productId as any; 
      return sum + (product.price || 0) * item.quantity;
    }, 0);

    
    const net = totalPrice - discount;

    return { total, totalPrice, discount, net };
  }
}
