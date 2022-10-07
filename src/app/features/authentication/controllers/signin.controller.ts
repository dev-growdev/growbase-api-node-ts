import { Request, Response } from 'express';

import { SignIn } from '@authentication/usecases';
import { AccountRepository } from '@authentication/repositories';
import { BcryptAdapter, JwtAdapter } from '@shared/adapters';
import { appEnvironments } from '@shared/envs';
import { AuthenticationDTO } from '@authentication/dtos';
import { notOk, ok, serverError } from '@shared/utils';

export class SignInController {
  async handle(request: Request, response: Response) {
    try {
      const { login, password } = request.body;

      const signIn = new SignIn(
        new AccountRepository(),
        new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN),
        new BcryptAdapter(appEnvironments.BCRYPT_SALT),
      );

      const authentication = new AuthenticationDTO({ login, password });

      const result = await signIn.execute(authentication);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> SignInController', error);
    }
  }
}
