import { createConnection, Connection } from 'typeorm';
import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Injectable()
export class DatabaseConnection implements OnApplicationShutdown {

  private readonly logger = new Logger(DatabaseConnection.name);
  private connection: Connection;

  get(): Connection {
    return this.connection;
  }

  async onApplicationShutdown(signal: string): Promise<void> {
    await this.connection.close();
  }

  async connect(): Promise<void> {
    const options: PostgresConnectionOptions = {
      type: 'postgres',
      host: this.isInDocker() ? 'store-abc-postgres' : 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      logging: false,
      entities: this.isInDocker() ? ['dist/data/models/**/*.js'] : ['src/data/models/**/*.ts'],
      migrations: this.isInDocker() ? ['dist/migrations/**/*.js'] : ['src/migrations/**/*.ts'],
      migrationsRun: true,
    };
    this.connection = await createConnection(options).then(async (connection: Connection) => {
      this.logger.log(`Connected to Postgres on ${options.host}:${options.port}`);
      return connection;
    });
    // TODO: catch error, throw fatal exception and shutdown service gracefully
  }

  private isInDocker(): boolean {
    return process.env.NODE_ENV === 'docker';
  }
}
