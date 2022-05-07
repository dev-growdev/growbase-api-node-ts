import { CustomError } from '.';

export class DomainError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
