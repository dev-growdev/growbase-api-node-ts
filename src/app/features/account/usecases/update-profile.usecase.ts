import { AccountDTO } from '@account/dtos';
import { AccountRepository } from '@account/repositories';
import { Result } from '@shared/utils';

export class UpdateProfile {
  readonly #accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.#accountRepository = accountRepository;
  }

  async execute(dto: Partial<AccountDTO>, userUid: string): Promise<Result<void>> {
    await this.#accountRepository.updateProfile(dto, userUid);

    return Result.success();
  }
}
