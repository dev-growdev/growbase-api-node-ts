import { CustomError } from '.';

export class AccessDeniedError extends CustomError {
  constructor() {
    super(`Access denied`);
    this.name = 'AccessDeniedError';
  }
}
