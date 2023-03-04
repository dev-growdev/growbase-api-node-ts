import { AuthMiddleware } from '@shared/middlewares';
import express from 'express';
import { FaqController } from './controllers';
import { FaqValidator } from './validators';

export default (router: express.Router): void => {
  const auth = new AuthMiddleware();

  router.get('/faqs', auth.handle, new FaqController().getAllFaqs);
  router.get('/faqs/:uid', auth.handle, new FaqController().getFaqByUid);
  router.post('/faqs', auth.handle, new FaqValidator().handle, new FaqController().createFaq);
  router.put('/faqs/:uid', auth.handle, new FaqValidator().handle, new FaqController().updateFaq);
  router.delete('/faqs/:uid', auth.handle, new FaqController().deleteFaq);
};
