import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Product } from './models/product';

@Injectable()
export class ProductsRepository {
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

  async findAll(): Promise<Product[]> {
    // const data = await this.readData();]
    return this.products;
  }

  async findById(id: number): Promise<Product | null> {
    // const products = await this.findAll();
    return this.products.find(p => p.id === id) || null;
  }

  async update(id: number, updatedProduct: Partial<Product>): Promise<Product | null> {
    const data = await this.readData();
    const index = data.products.findIndex((p: Product) => p.id === id);

    if (index !== -1) {
      data.products[index] = { ...data.products[index], ...updatedProduct };
      await fs.writeFile(this.jsonPath, JSON.stringify(data, null, 2));
      return data.products[index];
    }
    return null;
  }

  async create(newProduct: Product): Promise<Product> {
    // const data = await this.readData();
    // data.products.push(newProduct);
    // await fs.writeFile(this.jsonPath, JSON.stringify(data, null, 2));
    this.products.push(newProduct);
    return newProduct;
  }

  async delete(id: number): Promise<boolean> {
    const data = await this.readData();
    const index = data.products.findIndex((p: Product) => p.id === id);

    if (index !== -1) {
      data.products.splice(index, 1);
      await fs.writeFile(this.jsonPath, JSON.stringify(data, null, 2));
      return true;
    }
    return false;
  }
}