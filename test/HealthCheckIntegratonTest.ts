import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getAndStartApplication } from './getAppFixture';

describe('HealthCheck Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getAndStartApplication();
  });

  afterAll(async () => {
    app.close();
  });

  it('returns successful response', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('OK!');
  });
});
