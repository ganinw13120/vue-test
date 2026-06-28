import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './models/product';
import { ProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository) {}

    getAllProducts (keyword ?: string): Promise<Product[]> {
        return this.productsRepository.findAll(keyword);
    }

    getProductById(id: number): Promise<Product | null> {
        return this.productsRepository.findById(id);
    }

    create(newProduct: ProductDto): Promise<Product> {
        const productWithId: Product = {
            id : Date.now(),
            ...newProduct,
            logoLocation: newProduct.logoLocation || '',
            variableDenomPriceMinAmount: '',
            variableDenomPriceMaxAmount: '',
        };
        return this.productsRepository.create(productWithId);
    }

    async update(id : number, product: ProductDto): Promise<Product> {
        const existingProduct = await this.productsRepository.findById(id)
        if (!existingProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const newProduct: Product = {
            ...existingProduct,
            ...product
        }

        return this.productsRepository.update(id, newProduct)
    }

    async delete(id : number) {
        const product = await this.productsRepository.findById(id)
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return this.productsRepository.delete(id)
    }
}
