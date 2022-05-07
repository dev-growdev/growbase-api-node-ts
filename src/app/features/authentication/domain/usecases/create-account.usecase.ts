import { Command } from '@shared/domain/commands';
import { HasherAdapter } from '@shared/adapters';
import { DomainError } from '@shared/domain/errors';
import { ApplicationError, Result } from '@shared/utils';
import { CreateAccountCommand } from '../commands';
import { User } from '../models';
import { CheckUserByLoginRepository, CreateAccountRepository } from '../contracts';

export interface CreateAccount {
  execute(command: Command): Promise<Result<User>>;
}

export class CreateAccountImp implements CreateAccount {
  readonly #accountRepository: CreateAccountRepository & CheckUserByLoginRepository;
  readonly #hasherAdapter: HasherAdapter;

  constructor(
    accountRepository: CreateAccountRepository & CheckUserByLoginRepository,
    hasherAdapter: HasherAdapter,
  ) {
    this.#accountRepository = accountRepository;
    this.#hasherAdapter = hasherAdapter;
  }

  async execute(command: CreateAccountCommand): Promise<Result<User>> {
    command.validate();

    if (!command.isValid) {
      return Result.error(
        400,
        new ApplicationError(
          'execute -> CreateAccountImp',
          'Requisição inválida',
          command.notifications.map((notification) => ({
            name: notification.property,
            description: notification.message,
          })),
        ),
      );
    }

    const userAlreadyExists = await this.#accountRepository.checkUserByLogin(command.account.email);

    if (userAlreadyExists) throw new DomainError('Usuário já existe com este e-mail');

    const cipherPassword = await this.#hasherAdapter.hash(command.account.password);

    const account = Object.assign({}, command.account, { password: cipherPassword });

    const createdUser = await this.#accountRepository.createAccount(account);

    return Result.success(createdUser);
  }
}
