import { AccountRepository } from '@account/repositories';
import { CredentialUser } from '@models/credential-user.model';
import { BcryptAdapter } from '@shared/adapters';

import { ApplicationError, Result } from '@shared/utils';
import { LoadUserByLoginOrUidRepository } from '@shared/repositories';

export class UpdatePassword {
  readonly #encrypter: BcryptAdapter;
  readonly #accountRepository: AccountRepository;
  readonly #loadUserByLoginOrUidRepository: LoadUserByLoginOrUidRepository;

  constructor(
    encrypter: BcryptAdapter,
    accountRepository: AccountRepository,
    loadUserByLoginOrUidRepository: LoadUserByLoginOrUidRepository,
  ) {
    this.#encrypter = encrypter;
    this.#accountRepository = accountRepository;
    this.#loadUserByLoginOrUidRepository = loadUserByLoginOrUidRepository;
  }

  async execute(newPassword: string, oldPassword: string, userUid: string): Promise<Result<void>> {
    const user = await this.#loadUserByLoginOrUidRepository.loadUser({ uid: userUid });

    if (!user) {
      return Result.error(
        400,
        new ApplicationError('execute -> UpdatePassword', 'Usuário não encontrado', []),
      );
    }

    const credentialUser = user.credential as CredentialUser;

    const correctPassword = await this.#encrypter.compare(oldPassword, credentialUser.password);

    if (!correctPassword) {
      return Result.error(
        400,
        new ApplicationError('execute -> UpdatePassword', 'Senha inválida', []),
      );
    }

    const hasherPassword = await this.#encrypter.hash(newPassword);

    await this.#accountRepository.updatePassword(hasherPassword, userUid);

    return Result.success();
  }
}
