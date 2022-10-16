import { CredentialUser } from '@models/.';

export class CredentialUserBuilder {
  #login = 'any_login';
  #verified = true;
  #enable = true;
  #password = 'any_password';

  static init(): CredentialUserBuilder {
    return new CredentialUserBuilder();
  }

  builder(): CredentialUser {
    return new CredentialUser({
      login: this.#login,
      verified: this.#verified,
      enable: this.#enable,
      password: this.#password,
    });
  }
}
