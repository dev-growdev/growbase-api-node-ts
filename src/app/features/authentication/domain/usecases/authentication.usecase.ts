import { Command } from '@shared/domain/commands';
import { HashCompareAdapter, EncrypterAdapter } from '@shared/adapters';
import { DomainError } from '@shared/domain/errors';
import { ApplicationError, Result } from '@shared/utils';
import { AuthenticationCommand } from '../commands';
import { AuthUser, User } from '../models';
import { LoadUserByLoginRepository } from '../contracts';

interface AuthenticationDTO {
  user: User;
  token: string;
}

export interface Authentication {
  execute(command: Command): Promise<Result<AuthenticationDTO>>;
}

export class AuthenticationImp implements Authentication {
  readonly #userRepository: LoadUserByLoginRepository;
  readonly #hashCompareAdapter: HashCompareAdapter;
  readonly #encrypter: EncrypterAdapter;

  constructor(
    userRepository: LoadUserByLoginRepository,
    hashCompareAdater: HashCompareAdapter,
    encrypter: EncrypterAdapter,
  ) {
    this.#userRepository = userRepository;
    this.#hashCompareAdapter = hashCompareAdater;
    this.#encrypter = encrypter;
  }

  async execute(command: AuthenticationCommand): Promise<Result<AuthenticationDTO>> {
    command.validate();

    if (!command.isValid) {
      return Result.error(
        400,
        new ApplicationError(
          'execute -> AuthenticationImp',
          'Requisição inválida',
          command.notifications.map((notification) => ({
            name: notification.property,
            description: notification.message,
          })),
        ),
      );
    }

    const { login, password } = command;

    const user = await this.#userRepository.loadUserByLogin(login);

    if (!user) {
      return Result.error(
        400,
        new ApplicationError('execute -> AuthenticationImp', 'E-mail ou senha inválidos', []),
      );
    }

    const auth = user.auth as AuthUser;

    if (!auth.enable) throw new DomainError('Usuário não habilitado');
    if (!auth.verified) throw new DomainError('Usuário não verificado');

    const correctPassword = await this.#hashCompareAdapter.compare(
      password,
      user.auth?.password as string,
    );

    if (!correctPassword) {
      return Result.error(
        400,
        new ApplicationError('execute -> AuthenticationImp', 'E-mail ou senha inválidos', []),
      );
    }

    const token = await this.#encrypter.encrypt({ uid: user.uid, uidProfile: user.uidProfile });

    return Result.success({ user: Object.assign({}, user, { auth: undefined }), token });
  }
}
