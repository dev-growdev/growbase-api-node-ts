import { CreateExampleCommand } from '@example/domain/commands';
import { ExampleDTO } from '@example/domain/dtos';
import { ExampleDTOBuilder } from '..';

export class CreateExampleCommandBuilder {
  #example = ExampleDTOBuilder.init().builder();

  static init(): CreateExampleCommandBuilder {
    return new CreateExampleCommandBuilder();
  }

  withExample(example: ExampleDTO): CreateExampleCommandBuilder {
    this.#example = example;
    return this;
  }

  builder(): CreateExampleCommand {
    return new CreateExampleCommand(this.#example);
  }
}
