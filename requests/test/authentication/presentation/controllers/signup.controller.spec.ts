import { Controller, HttpRequest } from '@shared/presentation/contracts';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { User } from '@authentication/models';
import { CreateAccount } from '@authentication/domain/usecases';
import { SignUpController } from '@authentication/controllers';
import { CreateAccountCommand } from '@authentication/dtos';
import { AccountDtoBuilder, UserBuilder } from '@builders/authentication';
import { Result } from '@shared/utils';
import { ApplicationErrorBuilder } from '@builders/shared';

const makeRequest = (): HttpRequest => {
  return {
    body: AccountDtoBuilder.init().builder(),
    params: undefined,
  };
};

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountMock implements CreateAccount {
    execute(): Promise<Result<User>> {
      return Promise.resolve(Result.success(UserBuilder.init().builder()));
    }
  }

  return new CreateAccountMock();
};

interface SutTypes {
  sut: Controller;
  usecase: CreateAccount;
}
const makeSut = (): SutTypes => {
  const usecase = makeCreateAccount();
  const sut = new SignUpController(usecase);
  return { sut, usecase };
};
describe('SignUp Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should call CreateAccount with correct values', async () => {
    const { sut, usecase } = makeSut();
    const createAccountSpy = jest.spyOn(usecase, 'execute');
    const httpRequest = makeRequest();

    await sut.handle(httpRequest);

    const command = new CreateAccountCommand(httpRequest.body);
    command.validate();
    expect(createAccountSpy).toBeCalledWith(command);
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

    expect(response).toEqual(ok(Result.success(UserBuilder.init().builder())));
  });

  it('should return 500 if throw any exception', async () => {
    const { sut, usecase } = makeSut();

    const error = new Error('any_erro');
    error.stack = 'any_stack';

    jest.spyOn(usecase, 'execute').mockRejectedValue(error);
    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(serverError('handle -> SignUpController', error));
  });
});
