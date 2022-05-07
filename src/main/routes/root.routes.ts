import express, { Response, Request } from 'express';

export default (router: express.Application): void => {
  router.get('/', (_: Request, res: Response) => res.send('API HEALTH'));
};
