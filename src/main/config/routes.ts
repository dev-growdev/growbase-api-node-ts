import express, { Request, Response } from 'express';
import authenticationRoutes from '@authentication/authentication.routes';

export default (app: express.Application): void => {
  const router = express.Router();
  app.get('/', (_, res) => res.redirect('/api'));
  app.use('/api', router);

  router.get('/api', (_: Request, res: Response) => res.send('API HEALTH'));

  authenticationRoutes(router);
};
