import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

let config: DataSourceOptions;

if (process.env.NODE_ENV?.toLocaleLowerCase() === 'test') {
  config = {
    type: 'postgres',
    url: process.env.TEST_DATABASE_URL,
    ssl: undefined,
    entities: ['src/app/shared/database/entities/**/*'],
    migrations: ['src/app/shared/database/migrations/**/*'],
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
    entities: [rootDir + '/app/shared/database/entities/**/*'],
    migrations: [rootDir + '/app/shared/database/migrations/**/*'],
  };
}

export default config;
