import { Request, Response } from 'express';
import { notOk, ok, serverError } from '@shared/utils';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { BcryptAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/app.env';
import { RecoveryPassword } from '@account/usecases';
import { AccountRepository } from '@account/repositories';

export class RecoveryPasswordController {
  async recoveryPassword(request: Request, response: Response) {
    try {
      const { password, link } = request.body;
      const bcrypt = new BcryptAdapter(appEnvironments.BCRYPT_SALT);
      const redisRepository = new RedisRepository();
      const accountRepository = new AccountRepository();
      const recoveryPassword = new RecoveryPassword(bcrypt, redisRepository, accountRepository);

      const result = await recoveryPassword.execute({ password, link });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> RecoveryPasswordController', error);
    }
  }
}
