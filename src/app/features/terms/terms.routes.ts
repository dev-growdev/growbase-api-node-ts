import express from 'express';
import { AuthMiddleware } from '@shared/middlewares';
import { TermAndPolicyController } from './controllers';
import { CreateTermValidator } from './validators';

export default (router: express.Router): void => {
  const controller = new TermAndPolicyController();
  const createOrUpdateCategoryValidator = new CreateTermValidator();
  const auth = new AuthMiddleware();

  router.post('/terms', auth.handle, createOrUpdateCategoryValidator.handle, controller.createTerm);
  router.get('/terms', controller.getTerm);
};
