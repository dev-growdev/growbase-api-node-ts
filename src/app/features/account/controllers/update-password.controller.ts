import { Request, Response } from 'express';
import { notOk, ok, serverError } from '@shared/utils';
import { BcryptAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/app.env';
import { UpdatePassword } from '@account/usecases';
import { AccountRepository } from '@account/repositories';

export class UpdatePasswordController {
  async updatePassword(request: Request, response: Response) {
    try {
      const { password } = request.body;
      const { userUid } = request.authUser;
      const bcrypt = new BcryptAdapter(appEnvironments.BCRYPT_SALT);
      const accountRepository = new AccountRepository();
      const updatePassword = new UpdatePassword(bcrypt, accountRepository);

      const result = await updatePassword.execute(password, userUid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> UpdatePasswordController', error);
    }
  }
}
