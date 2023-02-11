import express from 'express';
import { SignInController, SignUpController, VerifyAccountController } from './controllers';
import { SignInValidator, SignUpValidator, VerifyAccountValidator } from './validators';

export default (router: express.Router): void => {
  router.post('/signup', new SignUpValidator().handle, new SignUpController().signUp);
  router.post('/signin', new SignInValidator().handle, new SignInController().signIn);
  router.post(
    '/verify-account',
    new VerifyAccountValidator().handle,
    new VerifyAccountController().verifyAccount,
  );
};
