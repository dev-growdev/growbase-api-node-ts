import { LogErrorDecorator } from '@main/decorators';
import { Controller, HttpRequest, HttpResponse } from '@shared/presentation/contracts';
import { ok, serverError } from '@shared/presentation/helpers';
import { redisHelper } from '@shared/database/connections/redis-helper';
import { Result } from '@shared/utils';

jest.mock('@shared/infra/data/connections/redis-helper');

const makeRequest = (): HttpRequest => ({
  body: {
    uid: 'any',
  },
  params: undefined,
});

const makeController = (): Controller => {
  class ControllerMock implements Controller {
    async handle(): Promise<HttpResponse> {
      return ok(Result.success());
    }
  }

  return new ControllerMock();
};

interface SutTypes {
  sut: LogErrorDecorator;
  controller: Controller;
}

const makeSut = (): SutTypes => {
  const controller = makeController();
  const sut = new LogErrorDecorator(controller);
  return { sut, controller };
};

describe('LogError Decorator', () => {
  beforeEach(() => jest.resetAllMocks());

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return response and not call redis-helper', async () => {
    const { sut } = makeSut();
    const setSpy = jest.spyOn(redisHelper, 'set');
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(ok(Result.success()));
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('should return response and call redis-helper with generic error', async () => {
    const { sut, controller } = makeSut();
    const setSpy = jest.spyOn(redisHelper, 'set');
    const error = new Error();
    error.stack = 'teste';
    jest.spyOn(controller, 'handle').mockResolvedValue(serverError('any', error));
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(serverError('any', error));
    expect(setSpy).toHaveBeenCalledTimes(1);
  });
});
