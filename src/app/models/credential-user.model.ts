export interface CredentialUserDTO {
  login: string;
  verified: boolean;
  enable: boolean;
  password: string;
}

export class CredentialUser {
  #login: string;
  get login(): string {
    return this.#login;
  }

  #verified: boolean;
  get verified(): boolean {
    return this.#verified;
  }

  #enable: boolean;
  get enable(): boolean {
    return this.#enable;
  }

  #password: string;
  get password(): string {
    return this.#password;
  }

  constructor({ login, password, verified, enable }: CredentialUserDTO) {
    this.#login = login;
    this.#password = password;
    this.#verified = verified;
    this.#enable = enable;
  }
}
