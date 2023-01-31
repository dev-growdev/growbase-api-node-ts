import express from 'express';
import { SignInController, SignUpController } from './controllers';
import { SignInValidator, SignUpValidator } from './validators';

export default (router: express.Router): void => {
  router.post('/signup', new SignUpValidator().handle, new SignUpController().signUp);
  router.post('/signin', new SignInValidator().handle, new SignInController().signIn);
};
