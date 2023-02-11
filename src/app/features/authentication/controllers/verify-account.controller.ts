import { Request, Response } from 'express';
import { VerifyAccount } from '@authentication/usecases';
import { notOk, ok, serverError } from '@shared/utils';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { AccountRepository } from '@authentication/repositories';

export class VerifyAccountController {
  async verifyAccount(request: Request, response: Response) {
    try {
      const accountRepository = new AccountRepository();
      const redisRepository = new RedisRepository();
      const verifyAccount = new VerifyAccount(redisRepository, accountRepository);

      const result = await verifyAccount.execute(request.body);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'handle -> VerifyAccountController', error);
    }
  }
}
