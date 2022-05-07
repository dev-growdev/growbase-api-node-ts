import { Contract, Notification } from '@shared/notifications';
import { Command } from '@shared/domain/commands';

interface AuthenticationDTO {
  login: string;
  password: string;
}

export class AuthenticationCommand extends Notification implements Command {
  login!: string;
  password: string;

  constructor(auth: AuthenticationDTO) {
    super();
    this.login = auth.login;
    this.password = auth.password;
  }

  validate(): void {
    this.addNotifications(
      new Contract()
        .isRequired(this.login, 'login')
        .isValidEmail(this.login, 'login')
        .isRequired(this.password, 'password'),
    );
  }
}
