import express from 'express';
import { readdirSync } from 'fs';

export default (app: express.Application): void => {
  const router = express.Router();
  app.get('/', (_, res) => res.redirect('/api'));
  app.use('/api', router);

  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    (await import(`../routes/${file}`)).default(router);
  });
};
