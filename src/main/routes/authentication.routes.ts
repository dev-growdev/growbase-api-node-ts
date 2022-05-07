import express from 'express';
import { makeSignUpController, makeSignInController } from '../factories';
import { adaptRoute } from '../adapters';

export default (router: express.Application): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/signin', adaptRoute(makeSignInController()));
};
