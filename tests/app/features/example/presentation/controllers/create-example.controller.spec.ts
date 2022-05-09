import { Result } from '@shared/utils';
import { CreateExampleController } from '@example/presentation/controllers';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { Controller, HttpRequest } from '@shared/presentation/contracts';
import { CreateExample } from '@example/domain/usecases';
import { ApplicationErrorBuilder } from '@builders/shared';
import { DomainError } from '@shared/domain/errors';
import { CreateExampleCommandBuilder, ExampleDTOBuilder } from '@builders/example';

const makeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    description: 'any_description',
  },
  params: undefined,
});

const makeCreateExample = (): CreateExample => {
  class CreateExampleMock implements CreateExample {
    execute(): Promise<Result<any>> {
      return Promise.resolve(
        Result.success({
          uid: 'any_uid',
          name: 'any_name',
          description: 'any_description',
        }),
      );
    }
  }
  return new CreateExampleMock();
};

interface SutTypes {
  sut: Controller;
  usecase: CreateExample;
}
const makeSut = (): SutTypes => {
  const usecase = makeCreateExample();
  const sut = new CreateExampleController(usecase);
  return { sut, usecase };
};

describe('CreateExample Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call CreateExample with correct values', async () => {
    const { sut, usecase } = makeSut();

    const spyUsecase = jest.spyOn(usecase, 'execute');
    const request = makeRequest();

    await sut.handle(request);

    const command = CreateExampleCommandBuilder.init()
      .withExample(ExampleDTOBuilder.init().withDescription('any_description').builder())
      .builder();

    command.validate();

    expect(spyUsecase).toHaveBeenCalledWith(command);
  });

  it("should return any http request code when result's usecase is invalid", async () => {
    const { sut, usecase } = makeSut();

    jest
      .spyOn(usecase, 'execute')
      .mockResolvedValue(Result.error(400, ApplicationErrorBuilder.init().builder()));

    const result = await sut.handle(makeRequest());

    expect(result).toEqual(notOk(Result.error(400, ApplicationErrorBuilder.init().builder())));
  });

  it('should return 200', async () => {
    const { sut } = makeSut();

    const result = await sut.handle(makeRequest());

    expect(result).toEqual(
      ok(
        Result.success({
          uid: 'any_uid',
          name: 'any_name',
          description: 'any_description',
        }),
      ),
    );
  });

  it('should return serverError if usecase throws', async () => {
    const { sut, usecase } = makeSut();

    const error = new DomainError('any_error');
    jest.spyOn(usecase, 'execute').mockRejectedValue(error);

    const result = await sut.handle(makeRequest());

    await expect(result).toEqual(serverError('handle -> CreateExampleController', error));
  });
});
