import { ProductDao } from '../src/data/ProductDao';
import { Product } from '../src/data/models/Product';
import { INestApplication } from '@nestjs/common';

export async function cleanUpProducts(app: INestApplication): Promise<void> {
  const productDao = app.get(ProductDao);
  const products = await productDao.list();
  await Promise.all(products.map(async (product: Product) => {
    await productDao.delete(product.id);
  }));
}
