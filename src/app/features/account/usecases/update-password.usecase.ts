import { AccountRepository } from '@account/repositories';
import { BcryptAdapter } from '@shared/adapters';

import { Result } from '@shared/utils';

export class UpdatePassword {
  readonly #encrypter: BcryptAdapter;
  readonly #accountRepository: AccountRepository;

  constructor(encrypter: BcryptAdapter, accountRepository: AccountRepository) {
    this.#encrypter = encrypter;
    this.#accountRepository = accountRepository;
  }

  async execute(password: string, userUid: string): Promise<Result<void>> {
    const hasherPassword = await this.#encrypter.hash(password);

    await this.#accountRepository.updatePassword(hasherPassword, userUid);

    return Result.success();
  }
}
