import { dataSource } from './src/main/database/typeorm';

(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
})();
