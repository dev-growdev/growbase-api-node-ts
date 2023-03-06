import { Request, Response } from 'express';
import { notOk, ok, serverError } from '@shared/utils';
import { BcryptAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/app.env';
import { UpdatePassword } from '@account/usecases';
import { AccountRepository } from '@account/repositories';
import { LoadUserByLoginOrUidRepository } from '@shared/repositories';

export class UpdatePasswordController {
  async updatePassword(request: Request, response: Response) {
    try {
      const { newPassword, oldPassword } = request.body;
      const { userUid } = request.authUser;
      const bcrypt = new BcryptAdapter(appEnvironments.BCRYPT_SALT);
      const accountRepository = new AccountRepository();
      const loadUserByLoginOrUidRepository = new LoadUserByLoginOrUidRepository();
      const updatePassword = new UpdatePassword(
        bcrypt,
        accountRepository,
        loadUserByLoginOrUidRepository,
      );

      const result = await updatePassword.execute(newPassword, oldPassword, userUid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> UpdatePasswordController', error);
    }
  }
}
