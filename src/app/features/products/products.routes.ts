import express from 'express';
import { AuthMiddleware } from '@shared/middlewares';
import { ProductController } from './controllers';
import { CreateOrUpdateProductValidator } from './validators';

export default (router: express.Router): void => {
  const controller = new ProductController();
  const auth = new AuthMiddleware();
  const createOrUpdateValidator = new CreateOrUpdateProductValidator();

  router.post('/products', auth.handle, createOrUpdateValidator.handle, controller.createProduct);
  router.get('/products', auth.handle, controller.getAllProducts);
  router.get('/products/:uid', auth.handle, controller.getProductByUid);
  router.put(
    '/products/:uid',
    auth.handle,
    createOrUpdateValidator.handle,
    controller.updateProduct,
  );
  router.delete('/products/:uid', auth.handle, controller.deleteProduct);
};
