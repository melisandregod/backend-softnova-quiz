import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from '../products/products.service';
import { Cart } from './schemas/cart.schema';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let mockCartModel: any;
  let mockProductsService: any;

  beforeEach(async () => {
    mockCartModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ id: '1', ...dto }), // Mock save
    }));
    mockCartModel.find = jest.fn().mockReturnThis();
    mockCartModel.findById = jest.fn().mockReturnThis();
    mockCartModel.findByIdAndUpdate = jest.fn().mockReturnThis();
    mockCartModel.findByIdAndDelete = jest.fn().mockReturnThis();
    mockCartModel.populate = jest.fn().mockReturnThis();
    mockCartModel.exec = jest.fn();

    mockProductsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getModelToken(Cart.name),
          useValue: mockCartModel,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart', async () => {
      const mockCartDto = { products: [] }; // Mock DTO
      const mockSavedCart = { id: '1', products: [] }; // Mock saved result

      const result = await service.create(mockCartDto);

      expect(mockCartModel).toHaveBeenCalledWith(mockCartDto);

      expect(mockCartModel.mock.results[0].value.save).toHaveBeenCalled();

      expect(result).toEqual(mockSavedCart);
    });
  });

  describe('findAll', () => {
    it('should return all carts', async () => {
      const mockCarts = [{ id: '1', products: [] }];
      mockCartModel.exec.mockResolvedValueOnce(mockCarts);

      const result = await service.findAll();

      expect(result).toEqual(mockCarts);
      expect(mockCartModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a cart by ID', async () => {
      const mockCart = { id: '1', products: [] };
      mockCartModel.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockCart),
      });

      const result = await service.findOne('1');
      expect(result).toEqual(mockCart);
    });

    it('should throw NotFoundException if cart not found', async () => {
      mockCartModel.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cart', async () => {
      const mockCart = { id: '1', products: [] };
      mockCartModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockCart),
      });

      const result = await service.update('1', { products: [] });
      expect(result).toEqual(mockCart);
      expect(mockCartModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { products: [] },
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete a cart', async () => {
      const mockDeletedCart = { id: '1', products: [] };
      mockCartModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockDeletedCart),
      });

      const result = await service.remove('1');
      expect(result).toEqual({ message: 'Delete Successful' });
      expect(mockCartModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if cart not found', async () => {
      mockCartModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculate', () => {
    it('should calculate the cart total, discount, and net price', async () => {
      const mockCart = {
        id: '1',
        products: [
          { productId: { _id: '101', price: 100 }, quantity: 1 },
          { productId: { _id: '102', price: 200 }, quantity: 1 },
        ],
      };
      mockCartModel.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockCart),
      });

      const result = await service.calculate('1');
      expect(result).toEqual({
        total: 2,
        totalPrice: 300,
        discount: 30, // Assuming 10% discount for 2 unique items
        net: 270,
      });
    });

    it('should throw NotFoundException if cart not found', async () => {
      mockCartModel.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.calculate('999')).rejects.toThrow(NotFoundException);
    });
  });
});
