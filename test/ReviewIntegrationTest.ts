import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Product } from '../src/data/models/Product';
import { getAndStartApplication } from './getAppFixture';
import { Review } from '../src/data/models/Review';
import { cleanUpProducts } from './cleanUpProducts';

describe('Review Integration Tests', () => {
  let app: INestApplication;
  let product: Product;

  beforeAll(async () => {
    app = await getAndStartApplication();
  });

  afterAll(async () => {
    await cleanUpProducts(app);
    app.close();
  });

  beforeEach(async () => {
    product = await request(app.getHttpServer())
      .post('/products')
      .send(new Product('Adidas Yeezy'))
      .expect(201)
      .then((response) => response.body);
  });

  describe('/products/:productId/reviews (POST)', () => {
    it('succeeds', async () => {
      const updatedProduct: Product = await request(app.getHttpServer())
        .post(`/products/${product.id}/reviews`)
        .send(new Review(3))
        .expect(201)
        .then((response) => response.body);

      expect(updatedProduct.id).toBe(product.id);
      expect(updatedProduct.name).toBe(product.name);
      expect(updatedProduct.reviews[0].id).toBeDefined();
      expect(updatedProduct.reviews[0].trueToSize).toBe(3);
    });

    it('fails when missing trueToSize data', async () => {
      await request(app.getHttpServer())
        .post(`/products/${product.id}/reviews`)
        .send({})
        .expect(400);
    });

    it('fails when trueToSize data is not a number', async () => {
      await request(app.getHttpServer())
        .post(`/products/${product.id}/reviews`)
        .send({ trueToSize: '3' })
        .expect(400);
    });

    it('fails when trueToSize data is outside 1..5 range', async () => {
      await request(app.getHttpServer())
        .post(`/products/${product.id}/reviews`)
        .send({ trueToSize: 6 })
        .expect(400);

      await request(app.getHttpServer())
        .post(`/products/${product.id}/reviews`)
        .send({ trueToSize: 0 })
        .expect(400);
    });

    it('fails when productId is for non existing product', async () => {
      await request(app.getHttpServer())
        .post(`/products/MISSING_ID/reviews`)
        .send(new Review(3))
        .expect(404);
    });
  });
});
