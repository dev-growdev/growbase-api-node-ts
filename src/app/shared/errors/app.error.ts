import { CustomError } from '.';

export class AppError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}
