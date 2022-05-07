import { Request, Response } from 'express';
import { Controller, HttpRequest } from '@shared/presentation/contracts';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      authenticatedUser: req.authenticatedUser,
    };

    const httpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
