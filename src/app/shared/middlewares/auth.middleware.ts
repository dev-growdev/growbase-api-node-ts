import { NextFunction, Response, Request } from 'express';
import { forbidden } from '@shared/utils';
import { JwtAdapter } from '@shared/adapters';
import { appEnvironments } from '@shared/envs';

export class AuthMiddleware {
  async handle(request: Request, response: Response, next: NextFunction) {
    const authorization = request.headers['authorization'];

    if (!authorization) return forbidden(response);

    const [, token] = authorization.split(' ');

    if (!token) return forbidden(response);

    const jwt = new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN);

    try {
      const data = await jwt.decrypt(token);
      request.authUser = data;

      return next();
    } catch (error) {
      return forbidden(response);
    }
  }
}
