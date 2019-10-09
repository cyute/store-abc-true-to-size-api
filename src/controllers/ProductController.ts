import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ProductDao } from '../data/ProductDao';
import { Product } from '../data/models/Product';
import { Review } from '../data/models/Review';

@Controller('/products')
export class ProductController {

  constructor(private readonly productDao: ProductDao) {
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.getProductOrThrow(id);
  }

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productDao.create(product);
  }

  @Post(':id/reviews')
  async createReview(@Param('id') id: string, @Body() review: Review): Promise<Product> {
    const product = await this.getProductOrThrow(id);
    return this.productDao.addReview(product, review);
  }

  private async getProductOrThrow(id: string): Promise<Product> {
    const product: Product = await this.productDao.get(id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found.`);
    }
    return product;
  }
}
