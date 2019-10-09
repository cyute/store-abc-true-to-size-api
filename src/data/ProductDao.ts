import { Injectable, Inject } from '@nestjs/common';
import { Product } from './models/Product';
import { Review } from './models/Review';
import { DatabaseConnection } from './DatabaseConnection';
import { Repository } from 'typeorm';
import * as uuid4 from 'uuid/v4';

@Injectable()
export class ProductDao {

  private productRepo: Repository<Product>;
  private reviewRepo: Repository<Review>;

  constructor(@Inject('CONNECTION') databaseConnection: DatabaseConnection) {
    this.productRepo = databaseConnection.get().getRepository(Product);
    this.reviewRepo = databaseConnection.get().getRepository(Review);
  }

  async get(productId: string): Promise<Product> {
    return this.productRepo.findOne(productId);
  }

  async list(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async create(product: Product): Promise<Product> {
    product.id = uuid4();
    await this.productRepo.save(product);
    return product;
  }

  async delete(productId: string): Promise<void> {
    await this.productRepo.delete(productId);
  }

  async addReview(product: Product, review: Review): Promise<Product> {
    review.id = uuid4();
    review.product = product;
    await this.reviewRepo.save(review);
    return this.get(product.id);
  }
}
