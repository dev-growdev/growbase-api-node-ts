import { Response } from 'express';
import { ApplicationError, Result } from '@shared/utils';
import { CustomError } from '@shared/errors';

export const ok = (response: Response, result: Result<any>) => {
  return response.status(200).json(result);
};

export const notOk = (response: Response, result: Result<any>) => {
  return response.status(result.code as number).json(result);
};

export const forbidden = (response: Response) => {
  return response
    .status(401)
    .json(Result.error(401, new ApplicationError('handle -> AuthMiddleware', 'Acesso negado', [])));
};

export const notFound = (response: Response, message: string) => {
  return response.status(404).json(Result.error(404, new ApplicationError('', message, [])));
};

export const serverError = (response: Response, process: string, error: Error | CustomError) => {
  return response.status(500).json(
    Result.error(
      500,
      new ApplicationError(
        process,
        error instanceof CustomError
          ? error.message
          : 'Aconteceu um erro inesperado, tente novamente ou entre em contato',
        [
          { name: 'stack', description: error?.stack ?? '' },
          { name: 'message', description: error?.message ?? '' },
        ],
      ),
    ),
  );
};
