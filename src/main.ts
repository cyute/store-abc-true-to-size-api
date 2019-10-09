import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ValidationPipe, Logger } from '@nestjs/common';

function logUnhandledRejections(): void {
  process.on('unhandledRejection', (error: any) => {
    const logger = new Logger('main');
    logger.error('unhandledRejection', error.stack); // TODO: alarm on these
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  logUnhandledRejections();
  await app.listen(3000);
}
bootstrap();
