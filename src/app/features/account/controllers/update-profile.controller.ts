import { Request, Response } from 'express';
import { notOk, ok, serverError } from '@shared/utils';
import { AccountRepository } from '@account/repositories';
import { UpdateProfile } from '@account/usecases';

export class UpdateProfileController {
  async updateProfile(request: Request, response: Response) {
    try {
      const { userUid } = request.authUser;
      const accountRepository = new AccountRepository();
      const updateProfile = new UpdateProfile(accountRepository);

      const result = await updateProfile.execute(request.body, userUid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> UpdateProfileController', error);
    }
  }
}
