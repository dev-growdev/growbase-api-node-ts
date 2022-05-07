import express from 'express';
import cors from 'cors';

export default (app: express.Application): void => {
  app.use(express.json());
  app.use(cors());

  app.use((_, res, next) => {
    res.type('json');
    next();
  });
};
