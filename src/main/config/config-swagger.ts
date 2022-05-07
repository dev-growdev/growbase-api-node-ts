import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import swaggerConfig from '../docs';
import { noCache } from '../middlewares';

export default (app: express.Application): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig));
};
