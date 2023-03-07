import express, { Request, Response } from 'express';
import authenticationRoutes from '@authentication/authentication.routes';
import categoriesRoutes from '@categories/categories.routes';
import productsRoutes from '@products/products.routes';
import accountRoutes from '@account/account.routes';
import termsRoutes from '@terms/terms.routes';
import faqsRoutes from '@faqs/faqs.routes';

export default (app: express.Application): void => {
  const router = express.Router();
  app.get('/', (_, res) => res.redirect('/api'));
  app.use('/api', router);
  router.get('/', (_: Request, res: Response) => res.send('API HEALTH'));

  authenticationRoutes(router);
  accountRoutes(router);
  categoriesRoutes(router);
  productsRoutes(router);
  termsRoutes(router);
  faqsRoutes(router);
};
