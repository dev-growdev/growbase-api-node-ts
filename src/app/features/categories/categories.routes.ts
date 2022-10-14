import express from 'express';
import { CategoryController } from './controllers';
import { CreateCategoryValidator } from './validators';

export default (router: express.Router): void => {
  const controller = new CategoryController();
  router.post('/categories', new CreateCategoryValidator().handle, controller.createCategory);
  router.get('/categories', controller.getAllCategories);
  router.put('/categories/:uid', controller.updateCategory);
  router.get('/categories/:uid', controller.getCategoryByUid);
  router.delete('/categories/:uid', controller.deleteCategory);
};
