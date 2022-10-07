import { Contract, Notification } from '@shared/notifications';
import { CpfCnpjDTO } from '.';
import '@shared/utils/extension-methods';

interface AccountData {
  name: string;
  email: string;
  document: string;
  password: string;
}

export class AccountDTO extends Notification {
  #name: string;
  get name(): string {
    return this.#name;
  }

  #email: string;
  get email(): string {
    return this.#email;
  }

  #document: CpfCnpjDTO;
  get document(): CpfCnpjDTO {
    return this.#document;
  }

  #password: string;
  get password(): string {
    return this.#password;
  }

  constructor({ name, document, email, password }: AccountData) {
    super();

    const cpfCnpj = new CpfCnpjDTO(document);

    this.addNotifications(
      new Contract()
        .isRequired(name, 'name')
        .isRequired(email, 'email')
        .isValidEmail(email, 'email')
        .isRequired(password, 'password')
        .isMinLength(password, 6, 'password', 'Senha muito curta'),
    );

    this.addNotifications(cpfCnpj.notifications);

    this.#name = name;
    this.#document = cpfCnpj;
    this.#email = email;
    this.#password = password;
  }

  updatePassword(encrypterPass: string): void {
    this.#password = encrypterPass;
  }
}
