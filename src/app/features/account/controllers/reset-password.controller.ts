import { Request, Response } from 'express';
import { notOk, ok, serverError } from '@shared/utils';
import { GmailService } from '@shared/external';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { BcryptAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/app.env';
import { ResetPassword } from '@account/usecases';
import { LoadUserByLoginOrUidRepository } from '@shared/repositories';

export class ResetPasswordController {
  async resetPassword(request: Request, response: Response) {
    try {
      const { email } = request.body;
      const bcrypt = new BcryptAdapter(appEnvironments.BCRYPT_SALT);
      const emailService = new GmailService();
      const redisRepository = new RedisRepository();
      const loadUserByLoginOrUidRepository = new LoadUserByLoginOrUidRepository();

      const resetPassword = new ResetPassword(
        bcrypt,
        emailService,
        redisRepository,
        loadUserByLoginOrUidRepository,
      );

      const result = await resetPassword.execute(email as string);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> ResetPasswordController', error);
    }
  }
}
