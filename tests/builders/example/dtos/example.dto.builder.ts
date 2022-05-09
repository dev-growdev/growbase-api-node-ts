import { ExampleDTO } from '@example/domain/dtos';

export class ExampleDTOBuilder {
  #name = 'any_name';
  #description?: string;

  static init(): ExampleDTOBuilder {
    return new ExampleDTOBuilder();
  }

  withDescription(description: string): ExampleDTOBuilder {
    this.#description = description;
    return this;
  }

  builder(): ExampleDTO {
    return {
      name: this.#name,
      description: this.#description,
    };
  }
}
