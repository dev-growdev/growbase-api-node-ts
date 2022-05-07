import express from 'express';
import { makeCreateProductController } from '../factories';
import { adaptRoute } from '../adapters';
import { auth } from '@main/middlewares';

export default (router: express.Application): void => {
  router.post('/products', auth, adaptRoute(makeCreateProductController()));
};
