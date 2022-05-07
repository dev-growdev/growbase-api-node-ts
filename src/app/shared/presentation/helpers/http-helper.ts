import { HttpResponse } from '../contracts';
import { ApplicationError, Result } from '@shared/utils';
import { DomainError } from '@shared/domain/errors';

export const ok = (result: Result<any>): HttpResponse => ({
  statusCode: 200,
  body: result,
});

export const notOk = (result: Result<any>): HttpResponse => ({
  statusCode: result.code as number,
  body: result,
});

export const forbidden = () => {
  return {
    statusCode: 403,
    body: Result.error(403, new ApplicationError('handle -> AuthMiddleware', 'Acesso negado', [])),
  };
};

export const serverError = (process: string, error: Error | DomainError): HttpResponse => ({
  statusCode: 500,
  body: Result.error(
    500,
    new ApplicationError(
      process,
      error instanceof DomainError
        ? error.message
        : 'Aconteceu um erro inesperado, tente novamente ou entre em contato',
      [
        { name: 'stack', description: error?.stack ?? '' },
        { name: 'message', description: error?.message ?? '' },
      ],
    ),
  ),
});
