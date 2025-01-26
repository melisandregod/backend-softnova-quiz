/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Types } from 'mongoose';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  // Mock CartService
  const mockCartService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    calculate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart', async () => {
      const createCartDto: CreateCartDto = {
        products: [
          { productId: '6442d256c3d2a344f8a1b555', quantity: 2 }, // productId เป็น string
        ],
      };

      const mockCart = {
        id: '1',
        products: [
          {
            productId: new Types.ObjectId('6442d256c3d2a344f8a1b555'), // productId เป็น ObjectId
            quantity: 2,
          },
        ],
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockCart);

      const result = await controller.create(createCartDto);

      expect(service.create).toHaveBeenCalledWith(createCartDto); // ตรวจสอบว่า service.create ถูกเรียกด้วย DTO
      expect(result).toEqual(mockCart); // ตรวจสอบผลลัพธ์
    });
  });

  describe('findAll', () => {
    it('should return all carts', async () => {
      const mockCarts = [{ id: '1', products: [] }];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockCarts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCarts);
    });
  });

  describe('findOne', () => {
    it('should return a single cart', async () => {
      const mockCart = { id: '1', products: [] };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockCart);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCart);
    });
  });

  describe('update', () => {
    it('should update a cart', async () => {
      const updateCartDto: UpdateCartDto = {
        products: [{ productId: '6442d256c3d2a344f8a1b555', quantity: 2 }],
      };

      const mockUpdatedCart = {
        id: '1',
        products: [
          {
            productId: new Types.ObjectId('6442d256c3d2a344f8a1b555'),
            quantity: 2,
          },
        ],
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(mockUpdatedCart);

      const result = await controller.update('1', updateCartDto);

      expect(service.update).toHaveBeenCalledWith('1', updateCartDto);
      expect(result).toEqual(mockUpdatedCart);
    });
  });

  describe('remove', () => {
    it('should delete a cart', async () => {
      const mockResponse = { message: 'Delete Successful' };

      jest.spyOn(service, 'remove').mockResolvedValueOnce(mockResponse);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('calculate', () => {
    it('should calculate the cart total, discount, and net price', async () => {
      const mockCalculation = {
        total: 2,
        totalPrice: 300,
        discount: 30,
        net: 270,
      };

      jest.spyOn(service, 'calculate').mockResolvedValueOnce(mockCalculation);

      const result = await controller.calculate('1');

      expect(service.calculate).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCalculation);
    });
  });
});
