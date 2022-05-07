import { AuthenticatedUserBuilder } from '@builders/shared';
import { CreateProductCommand } from '@products/domain/commands';
import { ProductDtoBuilder } from '..';

export class CreateProductCommandBuilder {
  #product = ProductDtoBuilder.init().builder();
  #authUser = AuthenticatedUserBuilder.init().builder();

  static init(): CreateProductCommandBuilder {
    return new CreateProductCommandBuilder();
  }

  builder(): CreateProductCommand {
    return new CreateProductCommand(this.#product, this.#authUser);
  }
}
