import { Module } from '@nestjs/common';
import { HealthCheckController } from './controllers/HealthCheckController';
import { ProductDao } from './data/ProductDao';
import { ProductController } from './controllers/ProductController';
import { DatabaseConnection } from './data/DatabaseConnection';
import { FactoryProvider } from '@nestjs/common/interfaces';

const connectionFactoryProvider: FactoryProvider = {
  provide: 'CONNECTION',
  useFactory: async (): Promise<DatabaseConnection> => {
    const databaseConnection = new DatabaseConnection();
    await databaseConnection.connect();
    return databaseConnection;
  },
};

@Module({
  imports: [],
  controllers: [HealthCheckController, ProductController],
  providers: [ProductDao, connectionFactoryProvider],
})
export class AppModule {}
