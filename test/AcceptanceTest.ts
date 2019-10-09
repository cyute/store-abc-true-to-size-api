import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Product } from '../src/data/models/Product';
import { Review } from '../src/data/models/Review';
import { getAndStartApplication } from './getAppFixture';
import { cleanUpProducts } from './cleanUpProducts';

describe('Acceptance Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getAndStartApplication();
  });

  afterAll(async () => {
    await cleanUpProducts(app);
    app.close();
  });

  describe('Gives correct TrueToSize calculations', () => {
    it('/products/:id/reviews (POST)', async () => {
      const product: Product = await request(app.getHttpServer())
        .post('/products')
        .send(new Product('Nike Air Force 1'))
        .expect(201)
        .then((response) => response.body);

      let foundProduct: Product = await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200)
        .then((response) => response.body);

      expect(foundProduct.trueToSizeCalculation).toBeUndefined();

      await addReviews(product.id, 1, 2, 2, 3, 2, 3, 2, 2, 3, 4, 2, 5, 2, 3);

      foundProduct = await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200)
        .then((response) => response.body);

      expect(foundProduct.trueToSizeCalculation).toBeCloseTo(2.5714285714286, 13);

      await addReviews(product.id, 2);

      foundProduct = await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200)
        .then((response) => response.body);

      expect(foundProduct.trueToSizeCalculation).toBeCloseTo(2.5333333333333, 13);
    });
  });

  async function addReviews(productId: string, ...trueToSizeValues: number[]): Promise<void> {
    await Promise.all(trueToSizeValues.map((trueToSizeValue: number) => {
      return request(app.getHttpServer())
        .post(`/products/${productId}/reviews`)
        .send(new Review(trueToSizeValue));
    }));
  }
});
