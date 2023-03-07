import { AuthMiddleware } from '@shared/middlewares';
import express from 'express';
import { AuthUserController, SignInController } from './controllers';
import { SignInValidator } from './validators';

export default (router: express.Router): void => {
  const auth = new AuthMiddleware();

  router.post('/signin', new SignInValidator().handle, new SignInController().signIn);
  router.get('/auth', auth.handle, new AuthUserController().authUser);
};
