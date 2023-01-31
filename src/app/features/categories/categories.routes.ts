import express from 'express';
import { AuthMiddleware } from '@shared/middlewares';
import { CategoryController } from './controllers';
import { CreateOrUpdateCategoryValidator } from './validators';

export default (router: express.Router): void => {
  const controller = new CategoryController();
  const createOrUpdateCategoryValidator = new CreateOrUpdateCategoryValidator();
  const auth = new AuthMiddleware();

  router.post(
    '/categories',
    auth.handle,
    createOrUpdateCategoryValidator.handle,
    controller.createCategory,
  );
  router.get('/categories', auth.handle, controller.getAllCategories);
  router.put(
    '/categories/:uid',
    auth.handle,
    createOrUpdateCategoryValidator.handle,
    controller.updateCategory,
  );
  router.get('/categories/:uid', auth.handle, controller.getCategoryByUid);
  router.delete('/categories/:uid', auth.handle, controller.deleteCategory);
};
