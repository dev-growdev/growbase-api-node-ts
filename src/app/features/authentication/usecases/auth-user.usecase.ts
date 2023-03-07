import { LoadUserByLoginOrUidRepository } from '@shared/repositories';
import { UserDTO } from '@models/user.model';
import { JwtAdapter } from '@shared/adapters';
import { ApplicationError, Result } from '@shared/utils';

interface Response {
  user: UserDTO;
  token: string;
}

export class AuthUser {
  readonly #repository: LoadUserByLoginOrUidRepository;
  readonly #jwt: JwtAdapter;

  constructor(repository: LoadUserByLoginOrUidRepository, jwt: JwtAdapter) {
    this.#repository = repository;
    this.#jwt = jwt;
  }

  async execute(userUid: string): Promise<Result<Response>> {
    const user = await this.#repository.loadUser({
      uid: userUid,
    });

    if (!user) {
      return Result.error(
        400,
        new ApplicationError('execute -> AuthUser', 'Usuário não encontrado', []),
      );
    }

    const token = await this.#jwt.encrypt({ userUid: user.userUid, profileUid: user.profileUid });

    user.clearCredential();

    return Result.success({ user: user.toJson(), token });
  }
}
