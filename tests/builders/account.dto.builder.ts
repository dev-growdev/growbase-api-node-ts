import { AccountDTO } from '@authentication/dtos';

type AccountDTOPartial = Partial<AccountDTO>;

export class AccountDtoBuilder {
  #name = 'any_name';
  #email = 'any_email@email.com';
  #document = '56520319058';
  #password = 'any_password';

  static init(): AccountDtoBuilder {
    return new AccountDtoBuilder();
  }

  undefined(): AccountDtoBuilder {
    this.#name = undefined as any;
    this.#email = undefined as any;
    this.#document = undefined as any;
    this.#password = undefined as any;
    return this;
  }

  with(account: AccountDTOPartial): AccountDtoBuilder {
    this.#name = account.name ? (account.name as any) : this.#name;
    this.#email = account.email ? (account.email as any) : this.#email;
    this.#password = account.password ? (account.password as any) : this.#password;
    this.#document = account.document ? (account.document as any) : this.#document;
    return this;
  }

  builder(): AccountDTO {
    return {
      name: this.#name,
      email: this.#email,
      document: this.#document,
      password: this.#password,
    };
  }
}
