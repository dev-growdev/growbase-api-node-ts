import { CreateAccountCommand } from '@authentication/domain/commands';
import { AccountDtoBuilder } from '..';

export class CreateAccountCommandBuilder {
  #account = AccountDtoBuilder.init().builder();

  static init(): CreateAccountCommandBuilder {
    return new CreateAccountCommandBuilder();
  }

  builder(): CreateAccountCommand {
    return new CreateAccountCommand(this.#account);
  }
}
