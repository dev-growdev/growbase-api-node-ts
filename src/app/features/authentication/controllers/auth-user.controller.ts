import { Request, Response } from 'express';

import { AuthUser } from '@authentication/usecases';
import { LoadUserByLoginOrUidRepository } from '@shared/repositories';
import { JwtAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/.';
import { notOk, ok, serverError } from '@shared/utils';

export class AuthUserController {
  async authUser(request: Request, response: Response) {
    try {
      const { userUid } = request.authUser;
      const authUser = new AuthUser(
        new LoadUserByLoginOrUidRepository(),
        new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN),
      );

      const result = await authUser.execute(userUid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> AuthUserController', error);
    }
  }
}
