import express from 'express';
import { CategoryController } from './controllers';
import { CreateOrUpdateCategoryValidator } from './validators';

export default (router: express.Router): void => {
  const controller = new CategoryController();
  const createOrUpdateCategoryValidator = new CreateOrUpdateCategoryValidator();

  router.post('/categories', createOrUpdateCategoryValidator.handle, controller.createCategory);
  router.get('/categories', controller.getAllCategories);
  router.put('/categories/:uid', createOrUpdateCategoryValidator.handle, controller.updateCategory);
  router.get('/categories/:uid', controller.getCategoryByUid);
  router.delete('/categories/:uid', controller.deleteCategory);
};
