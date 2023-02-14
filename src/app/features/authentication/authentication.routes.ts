import express from 'express';
import { SignInController } from './controllers';
import { SignInValidator } from './validators';

export default (router: express.Router): void => {
  router.post('/signin', new SignInValidator().handle, new SignInController().signIn);
};
