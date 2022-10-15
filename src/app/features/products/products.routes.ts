import express from 'express';
import { AuthMiddleware } from '@shared/middlewares';
import { ProductController } from './controllers';

export default (router: express.Router): void => {
  const controller = new ProductController();
  const auth = new AuthMiddleware();

  router.post('/products', auth.handle, controller.createProduct);
  router.get('/products', auth.handle, controller.getAllProducts);
};
