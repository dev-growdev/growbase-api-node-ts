import { Controller, HttpRequest } from '@shared/presentation/contracts';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { User } from '@authentication/domain/models';
import { Authentication } from '@authentication/domain/usecases';
import { SignInController } from '@authentication/presentation/controllers';
import { AuthenticationCommand } from '@authentication/domain/commands';
import { UserBuilder } from '@builders/authentication';
import { Result } from '@shared/utils';
import { ApplicationErrorBuilder } from '@builders/shared';

const makeRequest = (): HttpRequest => {
  return {
    body: {
      login: 'any@email.com',
      password: 'any',
    },
    params: undefined,
  };
};

const makeAuthentication = (): Authentication => {
  interface AuthenticationDTO {
    user: User;
    token: string;
  }
  class AuthenticationMock implements Authentication {
    async execute(): Promise<Result<AuthenticationDTO>> {
      return Result.success({
        user: UserBuilder.init().builder(),
        token: 'any_token',
      });
    }
  }

  return new AuthenticationMock();
};

interface SutTypes {
  sut: Controller;
  usecase: Authentication;
}
const makeSut = (): SutTypes => {
  const usecase = makeAuthentication();
  const sut = new SignInController(usecase);
  return { sut, usecase };
};

describe('SignIn Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should call Authentication with correct values', async () => {
    const { sut, usecase } = makeSut();
    const authenticationSpy = jest.spyOn(usecase, 'execute');
    const request = makeRequest();

    await sut.handle(request);

    const command = new AuthenticationCommand(request.body);
    command.validate();

    expect(authenticationSpy).toBeCalledWith(command);
  });

  it("should return any http request code when result's usecase is invalid", async () => {
    const { sut, usecase } = makeSut();

    jest
      .spyOn(usecase, 'execute')
      .mockResolvedValue(Result.error(400, ApplicationErrorBuilder.init().builder()));

    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(notOk(Result.error(400, ApplicationErrorBuilder.init().builder())));
  });

  it('should return 200 with user', async () => {
    const { sut } = makeSut();
    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(
      ok(Result.success({ user: UserBuilder.init().builder(), token: 'any_token' })),
    );
  });

  it('should return 500 if throw any exception', async () => {
    const { sut, usecase } = makeSut();

    const error = new Error('any_error');
    error.stack = 'any_stack';
    jest.spyOn(usecase, 'execute').mockRejectedValue(error);

    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(serverError('handle -> SignInController', error));
  });
});
