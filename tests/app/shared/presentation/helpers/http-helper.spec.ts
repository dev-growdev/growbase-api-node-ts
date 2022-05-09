import { ApplicationErrorBuilder } from '@builders/shared';
import { DomainError } from '@shared/domain/errors';
import { forbidden, notOk, ok, serverError } from '@shared/presentation/helpers';
import { Result } from '@shared/utils';

const domainError = (): DomainError => {
  class MockError extends DomainError {
    constructor() {
      super('any');
      this.name = 'MockError';
    }
  }
  return new MockError();
};

describe('HttpHelper', () => {
  it('should return status 200 and a object', () => {
    expect(ok(Result.success({ teste: 'any' }))).toEqual({
      statusCode: 200,
      body: {
        code: 200,
        success: true,
        data: { teste: 'any' },
      },
    });
  });

  it('should return status 400 and a error', () => {
    expect(notOk(Result.error(400, ApplicationErrorBuilder.init().builder()))).toEqual({
      statusCode: 400,
      body: {
        code: 400,
        success: false,
        error: ApplicationErrorBuilder.init().builder(),
      },
    });
  });

  it('should return status 403 and a error', () => {
    expect(forbidden()).toEqual({
      statusCode: 403,
      body: {
        success: false,
        code: 403,
        error: ApplicationErrorBuilder.init()
          .withProcess('handle -> AuthMiddleware')
          .withMessage('Acesso negado')
          .builder(),
      },
    });
  });

  it('should return status 500 and a error', () => {
    const error = new Error();
    error.stack = 'any_stack';

    const response = serverError('any', error);
    console.log(response.body.error);
    expect(response.statusCode).toBe(500);
    expect(response.body.error.message).toBe(
      'Aconteceu um erro inesperado, tente novamente ou entre em contato',
    );
    expect(response.body.error.process).toBe('any');
    expect(response.body.error.details[0].name).toBe('stack');
    expect(response.body.error.details[0].description).toBe('any_stack');
  });

  it('should return status 500 with domain error', () => {
    const error = domainError();
    error.stack = 'any_stack';

    const response = serverError('any', error);
    console.log(response.body.error);

    expect(response.statusCode).toBe(500);
    expect(response.body.error.message).toBe('any');
    expect(response.body.error.process).toBe('any');
    expect(response.body.error.details[0].name).toBe('stack');
    expect(response.body.error.details[0].description).toBe('any_stack');
  });

  it('should return status 500 with undefined error', () => {
    const error = undefined as any;

    const response = serverError('any', error);
    console.log(response.body.error);

    expect(response.statusCode).toBe(500);
    expect(response.body.error.message).toBe(
      'Aconteceu um erro inesperado, tente novamente ou entre em contato',
    );
    expect(response.body.error.process).toBe('any');
    expect(response.body.error.details[0].name).toBe('stack');
    expect(response.body.error.details[0].description).toBe('');
  });
});
