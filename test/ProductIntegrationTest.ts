import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Product } from '../src/data/models/Product';
import { getAndStartApplication } from './getAppFixture';
import { cleanUpProducts } from './cleanUpProducts';

describe('Product Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getAndStartApplication();
  });

  afterAll(async () => {
    await cleanUpProducts(app);
    app.close();
  });

  describe('/products (POST)', () => {
    it('succeeds', async () => {
      const product: Product = await request(app.getHttpServer())
        .post('/products')
        .send(new Product('Adidas Yeezy'))
        .expect(201)
        .then((response) => response.body);

      expect(product.name).toBe('Adidas Yeezy');
      expect(product.id).not.toBeUndefined();
    });

    it('fails because name is missing', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({})
        .expect(400);
    });

    it('fails because name is too long', async () => {
      const productWithLongName: Product = new Product('z'.repeat(201));
      await request(app.getHttpServer())
        .post('/products')
        .send(productWithLongName)
        .expect(400);
    });

    it('fails because name is not a string', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({ name: 123 })
        .expect(400);
    });
  });

  describe('/products/:id (GET)', () => {
    let product: Product;

    beforeEach(async () => {
      product = await request(app.getHttpServer())
        .post('/products')
        .send(new Product('Air Jordan 11'))
        .expect(201)
        .then((response) => response.body);
    });

    it('succeeds', async () => {
      const foundProduct: Product = await request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200)
        .then((response) => response.body);

      expect(foundProduct.name).toBe('Air Jordan 11');
      expect(foundProduct.id).toBe(product.id);
      expect(foundProduct.reviews).toHaveLength(0);
      expect(foundProduct.trueToSizeCalculation).toBeUndefined();
    });

    it('fails when trying to get a non existing product', async () => {
      await request(app.getHttpServer())
        .get(`/products/MISSING_ID`)
        .expect(404);
    });
  });
});
