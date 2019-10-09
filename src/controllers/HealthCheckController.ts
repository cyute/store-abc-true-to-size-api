import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {

  @Get()
  getHealthCheck(): string {
    return 'OK!';
  }
}
