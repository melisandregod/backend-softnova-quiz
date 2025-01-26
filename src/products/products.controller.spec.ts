/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from './dto/pagination.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
      };
      const mockProduct = { id: '1', ...createProductDto };

      mockProductService.create.mockResolvedValueOnce(mockProduct);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const paginationDto: PaginationDTO = { skip: 0, limit: 10 };
      const mockProducts = {
        data: [{ id: '1', name: 'Product 1', price: 100 }],
        total: 1,
      };

      mockProductService.findAll.mockResolvedValueOnce(mockProducts);

      const result = await controller.findAll(paginationDto);
      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const id = '1';
      const mockProduct = { id, name: 'Product 1', price: 100 };

      mockProductService.findOne.mockResolvedValueOnce(mockProduct);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };
      const updatedProduct = { id, ...updateProductDto };

      mockProductService.update.mockResolvedValueOnce(updatedProduct);

      const result = await controller.update(id, updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(id, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const id = '1';
      const mockResponse = { message: 'Delete Successful' };

      mockProductService.remove.mockResolvedValueOnce(mockResponse);

      const result = await controller.remove(id);
      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
