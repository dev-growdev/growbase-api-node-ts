import { JwtAdapter, BcryptAdapter } from '@shared/adapters';
import { ApplicationError, Result } from '@shared/utils';
import { AccountRepository } from '@authentication/repositories';
import { AppError } from '@shared/errors';
import { CredentialUser, UserDTO } from '@models/.';

interface Response {
  user: UserDTO;
  token: string;
}

interface AuthDTO {
  login: string;
  password: string;
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

  async execute({ login, password }: AuthDTO): Promise<Result<Response>> {
    const user = await this.#accountRepository.loadUserByLogin(login);

    if (!user) {
      return Result.error(
        400,
        new ApplicationError('execute -> SignIn', 'Login ou senha inválidos', []),
      );
    }

    const credentialUser = user.credential as CredentialUser;

    if (!credentialUser.enable) throw new AppError('Usuário não habilitado');
    if (!credentialUser.verified) throw new AppError('Usuário não verificado');

    const correctPassword = await this.#encrypter.compare(password, credentialUser.password);

    if (!correctPassword) {
      return Result.error(
        400,
        new ApplicationError('execute -> SigIn', 'Login ou senha inválidos', []),
      );
    }

    const token = await this.#jwt.encrypt({ userUid: user.userUid, profileUid: user.profileUid });

    user.clearCredential();

    return Result.success({ user: user.toJson(), token });
  }
}
