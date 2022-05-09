import { adaptRoute } from '@main/adapters';
import { makeCreateExampleController } from '@main/factories/controllers/example/create-example.factory';
import express from 'express';

export default (router: express.Application): void => {
  router.post('/examples', adaptRoute(makeCreateExampleController()));
};
