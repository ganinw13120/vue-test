import { Body, Controller, Get, Param, Patch, Post, Query, ParseIntPipe, Delete, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/products.dto';
import { Product } from './models/product';
import { ProductNotFoundError } from './exceptions/product-not-found.error';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    
    @Get()
    async getAllProducts (@Query('keyword') keyword?: string) {
        const product = this.productsService.getAllProducts(keyword);
        return product
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        try {
            const product = await this.productsService.getProductById(Number(id));
            return product
        } catch (e) {
            if (e instanceof ProductNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Post()
    async createNewProduct(@Body() productDto: ProductDto): Promise<Product> {
        return this.productsService.create(productDto);
    }

    @Patch(':id')
    async updateProduct(@Param('id', ParseIntPipe) id: number,@Body() productDto: ProductDto): Promise<Product> {
        try {
            return await this.productsService.update(id, productDto);
        } catch (e) {
            if (e instanceof ProductNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete(':id')
    async removeProduct(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.productsService.delete(id);
        } catch (e) {
            if (e instanceof ProductNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }
}
