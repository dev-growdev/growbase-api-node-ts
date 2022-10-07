import express from 'express';
import { SignInController, SignUpController } from './controllers';

export default (router: express.Router): void => {
  router.post('/signup', new SignUpController().handle);
  router.post('/signin', new SignInController().handle);
};
