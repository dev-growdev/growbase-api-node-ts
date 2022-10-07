import { CustomError } from '.';

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
