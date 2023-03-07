import { Request, Response } from 'express';
import { AccountRepository } from '@account/repositories';
import { ActiveAccount, CreateAccount } from '@account/usecases';
import { BcryptAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/.';
import { notOk, ok, serverError } from '@shared/utils';
import { GmailService } from '@shared/external';
import { RedisRepository } from '@shared/database/cache/redis.repository';

export class SignUpController {
  async signUp(request: Request, response: Response) {
    try {
      const emailService = new GmailService();
      const redisRepository = new RedisRepository();
      const activeAccountUsecase = new ActiveAccount(emailService, redisRepository);
      const createAccount = new CreateAccount(
        new AccountRepository(),
        new BcryptAdapter(appEnvironments.BCRYPT_SALT),
        activeAccountUsecase,
      );

      const result = await createAccount.execute(request.body);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> SignUpController', error);
    }
  }
}
