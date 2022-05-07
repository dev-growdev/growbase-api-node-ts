import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '@shared/presentation/contracts';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpRequest = {
      body: req.body,
      params: req.params,
      headers: req.headers,
    };

    const httpResponse = await middleware.handle(request);

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body.data);
      next();
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    }
  };
};
