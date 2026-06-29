import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepository } from './products.repository';
import { Product } from './models/product';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('ProductsRepository', () => {
  let repository: ProductsRepository;

  const mockProducts = [
    {
        id: 1,
        gvtId: 99,
        name: 'Be The King: Judge Destiny',
        productTagline: 'Top Up Be The King Gold in Codashop',
        shortDescription: '<a>Short description...</a>',
        longDescription: '<a>Long description...</a>',
        logoLocation: 'https://test.com/logo.png',
        productUrl: 'http://localhost.com',
        voucherTypeName: 'Discount',
        orderUrl: 'http://localhost.com',
        productTitle: 'Be The King: Judge Destiny (Canada) - Codashop',
        variableDenomPriceMinAmount: '0.0',
        variableDenomPriceMaxAmount: '0.0',
    },
    {
        id: 2,
        gvtId: 100,
        name: 'Ragnarok M: Eternal Love Big Cat Coin',
        productTagline: 'Top Up Ragnarok M: Eternal Love Big Cat Coins in Codashop',
        shortDescription: '<a>Short 2 description...</a>',
        longDescription: '<a>Long 2 description...</a>',
        logoLocation: 'https://test.com/logo.png',
        productUrl: 'http://localhost.com',
        voucherTypeName: 'Discount',
        orderUrl: 'http://localhost.com',
        productTitle: 'Ragnarok M: Eternal Love Big Cat Coin - Codashop',
        variableDenomPriceMinAmount: '0.0',
        variableDenomPriceMaxAmount: '0.0',
    }
  ]

  beforeEach(async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify({products: [...mockProducts]}));

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsRepository],
    }).compile();

    repository = module.get<ProductsRepository>(ProductsRepository);
    
    await (repository as any).loadData();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products if no search keyword is supplied', async () => {
      const result = await repository.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockProducts[0].id);
    });

    it('should successfully match products by keywords', async () => {
      const matchByName = await repository.findAll(mockProducts[0].name);
      const matchByShortDescription = await repository.findAll(mockProducts[0].shortDescription);
      const matchByLongDescription = await repository.findAll(mockProducts[0].longDescription);
      const matchByGvtId = await repository.findAll(mockProducts[0].gvtId.toString());

      expect(matchByName).toHaveLength(1);
      expect(matchByShortDescription).toHaveLength(1);
      expect(matchByLongDescription).toHaveLength(1);
      expect(matchByGvtId).toHaveLength(1);
    });

    it('should return empty array if no product matched', async () => {
      const result = await repository.findAll('test_mismatch');
      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should find a product by its uniquely identified entity key', async () => {
      const result = await repository.findById(1);
      expect(result).not.toBeNull();
    });

    it('should return null if identifier is not matching any product', async () => {
      const result = await repository.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should add new product into list', async () => {
      const freshProduct: Product = {
        ...mockProducts[0],
        id: 222,
        name: 'Lords Mobile',
      };

      const result = await repository.create(freshProduct);
      const entireList = await repository.findAll();

      expect(result.id).toBe(222);
      expect(entireList).toHaveLength(3);
    });
  });

  describe('update', () => {
    it('should locate existing arrays slots and rewrite changes seamlessly', async () => {
      const changes: Product = {
        ...mockProducts[0],
        name: 'Lords Mobile',
      };

      const result = await repository.update(1, changes);
      const verifiedRecord = await repository.findById(1);

      expect(result.name).toBe('Lords Mobile');
      expect(verifiedRecord?.name).toBe('Lords Mobile');
    });
  });

  describe('delete', () => {
    it('should splice and cut target indices directly out of in-memory lists', async () => {
      await repository.delete(1);
      const entireList = await repository.findAll();

      expect(entireList).toHaveLength(1);
    });
  });
});