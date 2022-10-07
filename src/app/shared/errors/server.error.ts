import { CustomError } from '.';

export class ServerError extends CustomError {
  constructor(stack?: string) {
    super('Internal server error');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
