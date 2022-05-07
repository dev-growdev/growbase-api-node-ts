import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

let config: DataSourceOptions;

if (process.env.NODE_ENV?.toLocaleLowerCase() === 'test') {
  config = {
    type: 'sqlite',
    database: './testdb.sql',
    entities: ['src/app/shared/infra/data/database/entities/**/*'],
    migrations: ['src/app/shared/infra/data/database/migrations/**/*'],
  };
} else {
  const isProduction = process.env.NODE_ENV?.toLocaleLowerCase() === 'production';
  const usingDocker = process.env.USING_DOCKER === 'true';

  const rootDir = isProduction ? 'dist' : 'src';

  const ssl = !usingDocker
    ? {
        rejectUnauthorized: false,
      }
    : undefined;

  config = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    ssl,
    entities: [rootDir + '/app/shared/infra/data/database/entities/**/*'],
    migrations: [rootDir + '/app/shared/infra/data/database/migrations/**/*'],
  };
}

export default config;
