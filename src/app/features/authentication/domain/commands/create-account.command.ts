import { AccountDTO } from '../dtos';
import { Contract, Notification } from '@shared/notifications';
import { Command } from '@shared/domain/commands';
import '@shared/utils/extension-methods';

export class CreateAccountCommand extends Notification implements Command {
  account!: AccountDTO;

  constructor(account: AccountDTO) {
    super();

    this.account = {
      name: account.name,
      document: account.document?.removeSpecialCharacters(),
      email: account.email,
      password: account.password,
      companyName: account.companyName,
    };
  }

  validate(): void {
    this.addNotifications(
      new Contract()
        .isRequired(this.account.name, 'name')
        .isRequired(this.account.email, 'email')
        .isValidEmail(this.account.email, 'email')
        .isRequired(this.account.document, 'document')
        .isValidCPFCNPJ(this.account.document, 'document')
        .isRequired(this.account.password, 'password')
        .isMinLength(this.account.password, 6, 'password', 'Senha muito curta')
        .isRequired(this.account.companyName, 'companyName'),
    );
  }
}
