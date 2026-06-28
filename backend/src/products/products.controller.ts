import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.products.dto';
import { Product } from './models/product';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    
    @Get()
    getAllProducts () {
        return this.productsService.getAllProducts();
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.productsService.getProductById(Number(id));
    }

    @Post()
    async createNewProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }
}
