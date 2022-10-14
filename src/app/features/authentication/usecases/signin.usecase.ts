import { JwtAdapter, BcryptAdapter } from '@shared/adapters';
import { ApplicationError, Result } from '@shared/utils';
import { User } from '@authentication/models';
import { AccountRepository } from '@authentication/repositories';
import { AuthenticationDTO, CredentialUserDTO } from '@authentication/dtos';
import { AppError } from '@shared/errors';

interface Response {
  user: User;
  token: string;
}

export class SignIn {
  readonly #accountRepository: AccountRepository;
  readonly #jwt: JwtAdapter;
  readonly #encrypter: BcryptAdapter;

  constructor(accountRepository: AccountRepository, jwt: JwtAdapter, encrypter: BcryptAdapter) {
    this.#accountRepository = accountRepository;
    this.#jwt = jwt;
    this.#encrypter = encrypter;
  }

  async execute(authentication: AuthenticationDTO): Promise<Result<Response>> {
    if (!authentication.isValid) {
      return Result.error(
        400,
        new ApplicationError(
          'execute -> Authentication',
          'Requisição inválida',
          authentication.notifications.map((notification) => ({
            name: notification.property,
            description: notification.message,
          })),
        ),
      );
    }

    const user = await this.#accountRepository.loadUserByLogin(authentication.login);

    if (!user) {
      return Result.error(
        400,
        new ApplicationError('execute -> AuthenticationImp', 'E-mail ou senha inválidos', []),
      );
    }

    const credentialUser = user.credential as CredentialUserDTO;

    if (!credentialUser?.enable) throw new AppError('Usuário não habilitado');
    if (!credentialUser?.verified) throw new AppError('Usuário não verificado');

    const correctPassword = await this.#encrypter.compare(
      authentication.password,
      credentialUser.password,
    );

    if (!correctPassword) {
      return Result.error(
        400,
        new ApplicationError('execute -> Authentication', 'E-mail ou senha inválidos', []),
      );
    }

    const token = await this.#jwt.encrypt({ userUid: user.userUid, profileUid: user.profileUid });

    user.clearCredential();

    return Result.success({ user: user.toJson(), token });
  }
}
