import { AccountDTO } from '@authentication/dtos';
import { User } from '@authentication/models';
import { AccountRepository } from '@authentication/repositories';
import { BcryptAdapter } from '@shared/adapters';
import { DomainError } from '@shared/errors';
import { ApplicationError, Result } from '@shared/utils';

export class CreateAccount {
  readonly #accountRepository: AccountRepository;
  readonly #encrypter: BcryptAdapter;

  constructor(accountRepository: AccountRepository, encrypter: BcryptAdapter) {
    this.#accountRepository = accountRepository;
    this.#encrypter = encrypter;
  }

  async execute(account: AccountDTO): Promise<Result<User>> {
    if (!account.isValid) {
      return Result.error(
        400,
        new ApplicationError(
          'execute -> CreateAccount',
          'Requisição inválida',
          account.notifications.map((notification) => ({
            name: notification.property,
            description: notification.message,
          })),
        ),
      );
    }

    const userAlreadyExists = await this.#accountRepository.checkUserByLogin(account.email);

    if (userAlreadyExists) throw new DomainError('Usuário já existe com este e-mail');

    const cipherPassword = await this.#encrypter.hash(account.password);

    account.updatePassword(cipherPassword);

    const user = await this.#accountRepository.createAccount(account);

    return Result.success(user.toJson());
  }
}
