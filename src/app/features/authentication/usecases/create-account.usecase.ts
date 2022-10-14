import { AccountRepository } from '@authentication/repositories';
import { UserDTO } from '@models/.';
import { BcryptAdapter } from '@shared/adapters';
import { AppError } from '@shared/errors';
import { Result } from '@shared/utils';

interface AccountDTO {
  name: string;
  email: string;
  document: string;
  password: string;
}

export class CreateAccount {
  readonly #accountRepository: AccountRepository;
  readonly #encrypter: BcryptAdapter;

  constructor(accountRepository: AccountRepository, encrypter: BcryptAdapter) {
    this.#accountRepository = accountRepository;
    this.#encrypter = encrypter;
  }

  async execute({ name, password, document, email }: AccountDTO): Promise<Result<UserDTO>> {
    const userAlreadyExists = await this.#accountRepository.checkUserByLogin(email);

    if (userAlreadyExists) throw new AppError('Usuário já existe com este e-mail');

    const cipherPassword = await this.#encrypter.hash(password);

    const user = await this.#accountRepository.createAccount({
      document,
      email,
      name,
      password: cipherPassword,
    });

    return Result.success(user.toJson());
  }
}
