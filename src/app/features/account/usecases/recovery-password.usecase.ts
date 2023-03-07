import { RecoveryPasswordDTO } from '@account/dtos';
import { AccountRepository } from '@account/repositories';
import { BcryptAdapter } from '@shared/adapters';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { ApplicationError, Result } from '@shared/utils';

export class RecoveryPassword {
  readonly #cache: RedisRepository;
  readonly #encrypter: BcryptAdapter;
  readonly #accountRepository: AccountRepository;

  constructor(
    encrypter: BcryptAdapter,
    cache: RedisRepository,
    accountRepository: AccountRepository,
  ) {
    this.#cache = cache;
    this.#encrypter = encrypter;
    this.#accountRepository = accountRepository;
  }

  async execute(dto: RecoveryPasswordDTO): Promise<Result<void>> {
    const cachedKey = `account:reset-password:link:${dto.link}`;

    const userUid = await this.#cache.get<string>(cachedKey);

    if (!userUid) {
      return Result.error(
        400,
        new ApplicationError('execute -> RecoveryPassword', 'Link inválido ou expirado', [
          {
            name: 'Link',
            description: 'Link inválido ou expirado',
          },
        ]),
      );
    }

    const hasherPassword = await this.#encrypter.hash(dto.password);

    await this.#accountRepository.updatePassword(hasherPassword, userUid);

    await this.#cache.delete(cachedKey);

    return Result.success();
  }
}
