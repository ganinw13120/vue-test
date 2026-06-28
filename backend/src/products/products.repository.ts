import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Product } from './models/product';

@Injectable()
export class ProductsRepository {

  // Load data into memory to prevent writing into mock file
  private products: Product[] = [];

  private readonly jsonPath = path.resolve(__dirname, '../../../api/mocks/products.json');
  
  constructor () {
    this.loadData();
  }

  private async loadData() {
    this.products = (await this.readData()).products;
  }

  private async readData() {
    const fileData = await fs.readFile(this.jsonPath, 'utf-8');
    return JSON.parse(fileData);
  }

  searchFromKeyword(product:Product, keyword : string) {
    const lowerKeyword = keyword.toLowerCase();
    if (product.name?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.shortDescription?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.longDescription?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.productTagline?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.productTitle?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.voucherTypeName?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.logoLocation?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.productUrl?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.orderUrl?.toLowerCase().includes(lowerKeyword)) return true;
    else if (product.gvtId?.toString().includes(lowerKeyword)) return true;
    else if (product.id?.toString().includes(lowerKeyword)) return true;
    return false
  }

  async findAll(keyword ?: string): Promise<Product[]> {
    if (keyword) {
      return this.products.filter(p=>this.searchFromKeyword(p, keyword))
    }
    return this.products;
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async update(id: number, updatedProduct: Product): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    this.products[index] = updatedProduct;
    
    return this.products[index];
  }

  async create(newProduct: Product): Promise<Product> {
    this.products.push(newProduct);
    return newProduct;
  }

  async delete(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    this.products.splice(index, 1)
  }
}