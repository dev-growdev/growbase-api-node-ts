import { AuthenticationCommand } from '@authentication/domain/commands';

export class AuthenticationCommandBuilder {
  #login = 'any@login.com';
  #password = 'any_password';

  static init(): AuthenticationCommandBuilder {
    return new AuthenticationCommandBuilder();
  }

  builder(): AuthenticationCommand {
    return new AuthenticationCommand({ login: this.#login, password: this.#password });
  }
}
