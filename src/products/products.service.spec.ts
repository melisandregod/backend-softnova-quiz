import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './schemas/products.schema';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: any;

  beforeEach(async () => {
    mockProductModel = {
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      countDocuments: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products with pagination', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 100 },
    ];
    mockProductModel.find().exec.mockResolvedValueOnce(mockProducts);
    mockProductModel.countDocuments.mockResolvedValueOnce(2);

    const result = await service.findAll({ skip: 0, limit: 10 });
    expect(result).toEqual({
      data: mockProducts,
      total: 2,
    });
  });

  it('should find a product by ID', async () => {
    const mockProduct = { id: '1', name: 'Product 1', price: 100 };

    mockProductModel.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const result = await service.findOne('1');
    expect(result).toEqual(mockProduct);
  });

  it('should throw NotFoundException if product not found', async () => {
    mockProductModel.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    await expect(service.findOne('999')).rejects.toThrow(
      'Product with id 999 not found',
    );
  });

  it('should delete a product by ID', async () => {
    const mockDeletedProduct = { id: '1', name: 'Product 1', price: 100 };

    mockProductModel.findByIdAndDelete.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockDeletedProduct),
    });

    const result = await service.remove('1');
    expect(result).toEqual({ message: 'Delete Successful' });
  });
});
