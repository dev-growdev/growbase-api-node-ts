import { ApplicationError, ApplicationErrorDetail } from '@shared/utils';

export class ApplicationErrorBuilder {
  #process = 'any';
  #message = 'any_message';
  #details: ApplicationErrorDetail[] = [];

  static init(): ApplicationErrorBuilder {
    return new ApplicationErrorBuilder();
  }

  withMessage(message: string): ApplicationErrorBuilder {
    this.#message = message;
    return this;
  }

  withDetails(details: ApplicationErrorDetail[]): ApplicationErrorBuilder {
    this.#details = details;
    return this;
  }

  withProcess(process: string): ApplicationErrorBuilder {
    this.#process = process;
    return this;
  }

  builder(): ApplicationError {
    return new ApplicationError(this.#process, this.#message, this.#details);
  }
}
