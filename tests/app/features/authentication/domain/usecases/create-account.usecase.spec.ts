import { DomainError } from '@shared/domain/errors';
import { HasherAdapter } from '@shared/adapters';
import { CreateAccount, CreateAccountImp } from '@authentication/domain/usecases';
import {
  CreateAccountRepository,
  CheckUserByLoginRepository,
} from '@authentication/domain/contracts';
import { User } from '@authentication/models';
import { CreateAccountCommand } from '@authentication/dtos';
import { CreateAccountCommandBuilder, UserBuilder } from '@builders/authentication';
import { Result } from '@shared/utils';
import { ApplicationErrorBuilder } from '@builders/shared';

type AccountRepository = CreateAccountRepository & CheckUserByLoginRepository;
const makeCommand = (): CreateAccountCommand => {
  return CreateAccountCommandBuilder.init().builder();
};

const makeAccountRepository = (): AccountRepository => {
  class AccountRepositoryMock implements AccountRepository {
    checkUserByLogin(): Promise<boolean> {
      return Promise.resolve(false);
    }
    createAccount(): Promise<User> {
      return Promise.resolve(UserBuilder.init().builder());
    }
  }

  return new AccountRepositoryMock();
};

const makeHasherAdapter = (): HasherAdapter => {
  class HasherAdapterMock implements HasherAdapter {
    hash(): Promise<string> {
      return Promise.resolve('any_hash');
    }
  }

  return new HasherAdapterMock();
};

interface SutTypes {
  sut: CreateAccount;
  accountRepository: AccountRepository;
  hasherAdapter: HasherAdapter;
}
const makeSut = (): SutTypes => {
  const accountRepository = makeAccountRepository();
  const hasherAdapter = makeHasherAdapter();
  const sut = new CreateAccountImp(accountRepository, hasherAdapter);
  return { sut, accountRepository, hasherAdapter };
};

describe('CreateAccount UseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  it('should return 400 if command is invalid', async () => {
    const { sut } = makeSut();

    const command = makeCommand();
    command.account.name = undefined as any;

    const response = await sut.execute(command);

    expect(response).toEqual(
      Result.error(
        400,
        ApplicationErrorBuilder.init()
          .withProcess('execute -> CreateAccountImp')
          .withMessage('Requisição inválida')
          .withDetails([{ description: 'Este campo é obrigatório', name: 'name' }])
          .builder(),
      ),
    );
  });

  it('should call CheckUserByLoginRepository with correct value', async () => {
    const { sut, accountRepository } = makeSut();
    const checkUserByLogin = jest.spyOn(accountRepository, 'checkUserByLogin');
    const command = makeCommand();

    await sut.execute(command);

    expect(checkUserByLogin).toHaveBeenCalledWith(command.account.email);
  });

  it('should return error if already exists user with email provided', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'checkUserByLogin').mockResolvedValue(true);
    const command = makeCommand();

    const promise = sut.execute(command);

    await expect(promise).rejects.toThrowError(
      new DomainError('Usuário já existe com este e-mail'),
    );
  });

  it('should return error if CheckUserByLoginRepository throws', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'checkUserByLogin').mockRejectedValue(new Error('any'));
    const command = makeCommand();

    const promise = sut.execute(command);

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should call HasherAdapter with correct value', async () => {
    const { sut, hasherAdapter } = makeSut();
    const hash = jest.spyOn(hasherAdapter, 'hash');
    const command = makeCommand();

    await sut.execute(command);

    expect(hash).toHaveBeenCalledWith(command.account.password);
  });

  it('should return error if HasherAdapter throws', async () => {
    const { sut, hasherAdapter } = makeSut();
    jest.spyOn(hasherAdapter, 'hash').mockRejectedValue(new Error('any'));
    const command = makeCommand();

    const promise = sut.execute(command);

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should call CreateAccountRepository with correct value', async () => {
    const { sut, accountRepository } = makeSut();
    const createUser = jest.spyOn(accountRepository, 'createAccount');
    const command = makeCommand();

    await sut.execute(command);

    expect(createUser).toHaveBeenCalledWith(
      Object.assign({}, command.account, { password: 'any_hash' }),
    );
  });

  it('should return error if CreateAccountRepository throws', async () => {
    const { sut, accountRepository } = makeSut();
    jest.spyOn(accountRepository, 'createAccount').mockRejectedValue(new Error('any'));
    const command = makeCommand();

    const promise = sut.execute(command);

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should return a User', async () => {
    const { sut } = makeSut();
    const command = makeCommand();

    const user = await sut.execute(command);

    expect(user).toEqual(Result.success(UserBuilder.init().builder()));
  });
});
