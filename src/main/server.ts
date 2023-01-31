import './config/module-alias';
import 'reflect-metadata';
import app from './config/app';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { redisHelper } from '@shared/database/connections/redis-helper';
import { appEnvironments } from '@envs/.';

Promise.all([pgHelper.connect(), redisHelper.connect(appEnvironments.REDIS_URL)])
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log('Server is running on port ', port));
  })
  .catch(console.error);
