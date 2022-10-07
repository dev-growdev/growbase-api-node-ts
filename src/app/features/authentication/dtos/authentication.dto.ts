import { Contract, Notification } from '@shared/notifications';

interface AuthenticationData {
  login: string;
  password: string;
}

export class AuthenticationDTO extends Notification {
  #login: string;
  get login(): string {
    return this.#login;
  }

  #password: string;
  get password(): string {
    return this.#password;
  }

  constructor({ login, password }: AuthenticationData) {
    super();

    this.addNotifications(
      new Contract()
        .isRequired(login, 'Login')
        .isValidEmail(login, 'Login')
        .isRequired(password, 'Senha')
        .isMinLength(password, 6, 'Senha', 'Senha deve ter no minímo 6 caracteres'),
    );

    this.#login = login;
    this.#password = password;
  }
}
