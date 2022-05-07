import { EncrypterAdapter, HashCompareAdapter } from '@shared/adapters';
import { DomainError } from '@shared/domain/errors';
import { Authentication, AuthenticationImp } from '@authentication/domain/usecases';
import { LoadUserByLoginRepository } from '@authentication/domain/contracts';
import { User } from '@authentication/domain/models';
import { AuthenticationCommand } from '@authentication/domain/commands';
import { AuthenticationCommandBuilder, UserBuilder } from '@builders/authentication';
import { Result } from '@shared/utils';
import { ApplicationErrorBuilder } from '@builders/shared';

const makeCommand = (): AuthenticationCommand => {
  return AuthenticationCommandBuilder.init().builder();
};

const makeAccountRepository = (): LoadUserByLoginRepository => {
  class AccountRepositoryMock implements LoadUserByLoginRepository {
    loadUserByLogin(): Promise<User | undefined> {
      return Promise.resolve(UserBuilder.init().withAuth().builder());
    }
  }

  return new AccountRepositoryMock();
};

const makeHashCompareAdapter = (): HashCompareAdapter => {
  class HashCompareAdapterMock implements HashCompareAdapter {
    compare(): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  return new HashCompareAdapterMock();
};

const makeEncrypterAdapterMock = (): EncrypterAdapter => {
  class EncrypterAdapterMock implements EncrypterAdapter {
    encrypt(): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new EncrypterAdapterMock();
};

interface SutTypes {
  sut: Authentication;
  userRepository: LoadUserByLoginRepository;
  hasherCompareAdapter: HashCompareAdapter;
  encrypterAdapter: EncrypterAdapter;
}
const makeSut = (): SutTypes => {
  const userRepository = makeAccountRepository();
  const hasherCompareAdapter = makeHashCompareAdapter();
  const encrypterAdapter = makeEncrypterAdapterMock();
  const sut = new AuthenticationImp(userRepository, hasherCompareAdapter, encrypterAdapter);

  return { sut, userRepository, hasherCompareAdapter, encrypterAdapter };
};

describe('Authentication UseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  it('should return 400 if command is invalid', async () => {
    const { sut } = makeSut();

    const command = makeCommand();
    command.login = undefined as any;

    const response = await sut.execute(command);

    expect(response).toEqual(
      Result.error(
        400,
        ApplicationErrorBuilder.init()
          .withProcess('execute -> AuthenticationImp')
          .withMessage('Requisição inválida')
          .withDetails([
            { description: 'Este campo é obrigatório', name: 'login' },
            { description: 'E-mail inválido', name: 'login' },
          ])
          .builder(),
      ),
    );
  });

  it('should call LoadUserByLoginRepository with correct value', async () => {
    const { sut, userRepository } = makeSut();
    const loadUserByLogin = jest.spyOn(userRepository, 'loadUserByLogin');

    const command = makeCommand();
    await sut.execute(command);

    expect(loadUserByLogin).toHaveBeenCalledWith(command.login);
  });

  it('should return error if user does not found with login provided', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'loadUserByLogin').mockResolvedValue(undefined);

    const result = await sut.execute(makeCommand());

    expect(result).toEqual(
      Result.error(
        400,
        ApplicationErrorBuilder.init()
          .withProcess('execute -> AuthenticationImp')
          .withMessage('E-mail ou senha inválidos')
          .builder(),
      ),
    );
  });

  it('should return error if LoadUserByLoginRepository throws', async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, 'loadUserByLogin').mockRejectedValue(new Error('any'));

    const promise = sut.execute(makeCommand());

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should return error if user is not enable', async () => {
    const { sut, userRepository } = makeSut();
    jest
      .spyOn(userRepository, 'loadUserByLogin')
      .mockResolvedValue(UserBuilder.init().withAuth({ enable: false }).builder());

    const promise = sut.execute(makeCommand());

    await expect(promise).rejects.toThrowError(new DomainError('Usuário não habilitado'));
  });

  it('should return error if user is not verified', async () => {
    const { sut, userRepository } = makeSut();
    jest
      .spyOn(userRepository, 'loadUserByLogin')
      .mockResolvedValue(UserBuilder.init().withAuth({ verified: false }).builder());

    const promise = sut.execute(makeCommand());

    await expect(promise).rejects.toThrowError(new DomainError('Usuário não verificado'));
  });

  it('should call HashCompareAdapter with correct value', async () => {
    const { sut, hasherCompareAdapter } = makeSut();
    const compare = jest.spyOn(hasherCompareAdapter, 'compare');

    const command = makeCommand();
    await sut.execute(command);

    expect(compare).toHaveBeenCalledWith(command.password, 'any_password');
  });

  it('should return error if HashCompareAdapter throws', async () => {
    const { sut, hasherCompareAdapter } = makeSut();
    jest.spyOn(hasherCompareAdapter, 'compare').mockRejectedValue(new Error('any'));

    const promise = sut.execute(makeCommand());

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should return error if password provided is incorrect', async () => {
    const { sut, hasherCompareAdapter } = makeSut();
    jest.spyOn(hasherCompareAdapter, 'compare').mockResolvedValue(false);

    const result = await sut.execute(makeCommand());

    expect(result).toEqual(
      Result.error(
        400,
        ApplicationErrorBuilder.init()
          .withProcess('execute -> AuthenticationImp')
          .withMessage('E-mail ou senha inválidos')
          .builder(),
      ),
    );
  });

  it('should call EncrypterAdapter with correct value', async () => {
    const { sut, encrypterAdapter } = makeSut();
    const encrypt = jest.spyOn(encrypterAdapter, 'encrypt');

    const command = makeCommand();
    await sut.execute(command);

    const { uid, uidProfile } = UserBuilder.init().builder();

    expect(encrypt).toHaveBeenCalledWith({ uid, uidProfile });
  });

  it('should return error if EncrypterAdapter throws', async () => {
    const { sut, encrypterAdapter } = makeSut();
    jest.spyOn(encrypterAdapter, 'encrypt').mockRejectedValue(new Error('any'));

    const promise = sut.execute(makeCommand());

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should return the user and jwt token', async () => {
    const { sut } = makeSut();
    const result = await sut.execute(makeCommand());

    expect(result).toEqual(
      Result.success({
        user: UserBuilder.init().builder(),
        token: 'any_token',
      }),
    );
  });
});
