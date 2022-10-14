import { Request, Response } from 'express';

import { SignIn } from '@authentication/usecases';
import { AccountRepository } from '@authentication/repositories';
import { BcryptAdapter, JwtAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/.';
import { notOk, ok, serverError } from '@shared/utils';

export class SignInController {
  async signIn(request: Request, response: Response) {
    try {
      const signIn = new SignIn(
        new AccountRepository(),
        new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN),
        new BcryptAdapter(appEnvironments.BCRYPT_SALT),
      );

      const result = await signIn.execute(request.body);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> SignInController', error);
    }
  }
}
