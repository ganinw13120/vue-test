import { Body, Controller, Get, Param, Patch, Post, Query, ParseIntPipe, Delete, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/products.dto';
import { Product } from './models/product';

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
        const product = await this.productsService.getProductById(Number(id));
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product
    }

    @Post()
    async createNewProduct(@Body() productDto: ProductDto): Promise<Product> {
        return this.productsService.create(productDto);
    }

    @Patch(':id')
    async updateProduct(@Param('id', ParseIntPipe) id: number,@Body() productDto: ProductDto): Promise<Product> {
        return this.productsService.update(id, productDto);
    }

    @Delete(':id')
    async removeProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.delete(id);
    }
}
