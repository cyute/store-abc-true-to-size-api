import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './HealthCheckController';

describe('HealthCheckController', () => {
  let healthCheckController: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [],
    }).compile();

    healthCheckController = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('getHealthCheck', () => {
    it('should return "OK!"', () => {
      expect(healthCheckController.getHealthCheck()).toBe('OK!');
    });
  });
});
