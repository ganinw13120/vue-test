import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from './models/product';
import { ProductDto } from './dto/products.dto';
import { ProductNotFoundError } from './exceptions/product-not-found.error';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  // Mock domain data blueprints for validation checks
  const mockProduct: Product = {
    id: 1,
    gvtId: 1,
    name : "Game of Sultans ",
    productTagline: 'Best on the market',
    shortDescription: '<p>Short HTML text</p>',
    longDescription: '<div>Detailed specifications</div>',
    logoLocation: 'http://localhost/logo.png',
    productUrl: 'http://localhost/prod',
    voucherTypeName: 'MECHANIST',
    orderUrl: 'http://localhost/order',
    productTitle: 'Official Title',
    variableDenomPriceMinAmount: '0.0',
    variableDenomPriceMaxAmount: '0.0',
  };

  const mockProductDto: ProductDto = {
    name: 'Game of Sultans ',
    gvtId: 1,
    productTagline: 'Example tagline',
    shortDescription: '<p>New Short description</p>',
    longDescription: '<div>New Long description</div>',
    productUrl: 'http://localhost/new-prod',
    voucherTypeName: 'MECHANIST',
    orderUrl: 'http://localhost/new-order',
    productTitle: 'New Title',
  };

  // 💡 Mocking Object for the Repository Gateway Layer
  const mockProductsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return an array of all products matching optional keyword', async () => {
      mockProductsRepository.findAll.mockResolvedValue([mockProduct]);

      const result = await service.getAllProducts('test_keyword');

      expect(repository.findAll).toHaveBeenCalledWith('test_keyword');
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('getProductById', () => {
    it('should return a product entity matching target id', async () => {
      mockProductsRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.getProductById(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw ProductNotFoundError if the product are not existed', async () => {
      mockProductsRepository.findById.mockResolvedValue(null);

      await expect(service.getProductById(1)).rejects.toThrow(ProductNotFoundError);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should build a product with default value and id', async () => {
      const mockTimestamp = 1600000000000;
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      const expectedSavedProduct: Product = {
        id: mockTimestamp,
        ...mockProductDto,
        logoLocation: '',
        variableDenomPriceMinAmount: '',
        variableDenomPriceMaxAmount: '',
      };

      mockProductsRepository.create.mockResolvedValue(expectedSavedProduct);

      const result = await service.create(mockProductDto);

      expect(repository.create).toHaveBeenCalledWith(expectedSavedProduct);
      expect(result).toEqual(expectedSavedProduct);
    });
  });

  describe('update', () => {
    it('should fetch the existing entity, merge field changes, and trigger repo save modifications', async () => {
      mockProductsRepository.findById.mockResolvedValue(mockProduct);
      
      const mergedExpectedResult: Product = {
        ...mockProduct,
        ...mockProductDto,
      };
      mockProductsRepository.update.mockResolvedValue(mergedExpectedResult);

      const result = await service.update(1, mockProductDto);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, mergedExpectedResult);
      expect(result).toEqual(mergedExpectedResult);
    });

    it('should throw ProductNotFoundError if trying to update an entity that does not exist', async () => {
      mockProductsRepository.findById.mockResolvedValue(null);

      await expect(service.update(1, mockProductDto)).rejects.toThrow(ProductNotFoundError);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should successfully execute structural removal execution if resource ID matches records', async () => {
      mockProductsRepository.findById.mockResolvedValue(mockProduct);
      mockProductsRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ProductNotFoundError on delete commands if targeted identifier key is missing', async () => {
      mockProductsRepository.findById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(ProductNotFoundError);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});