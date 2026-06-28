import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './models/product';
import { CreateProductDto } from './dto/create.products.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository) {}

    getAllProducts (): Promise<Product[]> {
        return this.productsRepository.findAll();
    }

    getProductById(id: number): Promise<Product | null> {
        return this.productsRepository.findById(id);
    }

    create(newProduct: CreateProductDto): Promise<Product> {
        const productWithId: Product = {
            id : Date.now(),
            ...newProduct,
            logoLocation: newProduct.logoLocation || '',
            variableDenomPriceMinAmount: newProduct.variableDenomPriceMinAmount || '',
            variableDenomPriceMaxAmount: newProduct.variableDenomPriceMaxAmount || '',
        };
        return this.productsRepository.create(productWithId);
    }
}
