import { Request, Response } from 'express';
import { AccountRepository } from '@authentication/repositories';
import { CreateAccount } from '@authentication/usecases';
import { BcryptAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/.';
import { notOk, ok, serverError } from '@shared/utils';

export class SignUpController {
  async signUp(request: Request, response: Response) {
    try {
      const createAccount = new CreateAccount(
        new AccountRepository(),
        new BcryptAdapter(appEnvironments.BCRYPT_SALT),
      );

      const result = await createAccount.execute(request.body);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> SignUpController', error);
    }
  }
}
