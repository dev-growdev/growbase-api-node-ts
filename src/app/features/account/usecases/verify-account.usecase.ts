import { CheckCodeDTO } from '@account/dtos';
import { AccountRepository } from '@account/repositories';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { AppError } from '@shared/errors';
import { Result } from '@shared/utils';

export class VerifyAccount {
  readonly #cache: RedisRepository;
  readonly #accountRepository: AccountRepository;

  constructor(cache: RedisRepository, accountRepository: AccountRepository) {
    this.#cache = cache;
    this.#accountRepository = accountRepository;
  }

  async execute(dto: CheckCodeDTO): Promise<Result<void>> {
    const userUid = await this.#cache.get<string>(
      `account:activation:${dto.email}:code:${dto.code}`,
    );

    if (!userUid) throw new AppError('Código de ativação inválido ou expirado');

    await this.#accountRepository.verifyAccount(userUid);

    await this.#cache.delete(`account:activation:${dto.email}`);

    return Result.success();
  }
}
